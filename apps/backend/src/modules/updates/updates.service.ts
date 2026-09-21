interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  content_type: string;
  browser_download_url: string;
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
}

export interface CheckUpdateResult {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes?: string;
  assetId?: number;
  fileName?: string;
  size?: number;
}

/**
 * Compara dos versiones en formato semver (ej. "0.1.2" vs "0.1.1").
 * Retorna 1 si v1 > v2, -1 si v1 < v2, 0 si son iguales.
 */
export const compareVersions = (v1: string, v2: string): number => {
  const cleanV1 = v1.replace(/^v/, "").trim();
  const cleanV2 = v2.replace(/^v/, "").trim();

  const parts1 = cleanV1.split(".").map((n) => parseInt(n, 10) || 0);
  const parts2 = cleanV2.split(".").map((n) => parseInt(n, 10) || 0);

  const length = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < length; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};

const getGitHubHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "PCStore-Backend",
    Accept: "application/vnd.github+json",
  };

  if (token && token.trim() !== "") {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return headers;
};

export const getLatestRelease = async (): Promise<GitHubRelease> => {
  const owner = process.env.GITHUB_REPO_OWNER || "NovaTechdDes";
  const repo = process.env.GITHUB_REPO_NAME || "PCStore";

  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const response = await fetch(url, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al consultar GitHub Releases (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as GitHubRelease;
  return data;
};

export const checkUpdate = async (
  currentVersion: string
): Promise<CheckUpdateResult> => {
  const release = await getLatestRelease();
  const latestVersion = release.tag_name.replace(/^v/, "");

  const hasNewerVersion = compareVersions(latestVersion, currentVersion) > 0;

  if (!hasNewerVersion) {
    return {
      updateAvailable: false,
      currentVersion,
      latestVersion,
    };
  }

  // Buscar el asset de instalación de Windows (.exe o .msi)
  const installerAsset = release.assets.find(
    (asset) =>
      asset.name.endsWith("-setup.exe") ||
      asset.name.endsWith(".exe") ||
      asset.name.endsWith(".msi")
  );

  return {
    updateAvailable: true,
    currentVersion,
    latestVersion,
    releaseNotes: release.body || "",
    assetId: installerAsset?.id,
    fileName: installerAsset?.name,
    size: installerAsset?.size,
  };
};

export const fetchAssetStream = async (assetId: string | number) => {
  const owner = process.env.GITHUB_REPO_OWNER || "NovaTechdDes";
  const repo = process.env.GITHUB_REPO_NAME || "PCStore";

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    "User-Agent": "PCStore-Backend",
    Accept: "application/octet-stream",
  };

  if (token && token.trim() !== "") {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/releases/assets/${assetId}`;

  const response = await fetch(url, {
    headers,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `Error al descargar asset de GitHub (${response.status}): ${response.statusText}`
    );
  }

  return response;
};
