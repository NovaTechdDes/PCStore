import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';


interface Props {
    titulo: string;
    descripcion: string;
    textoBoton?: string;
    children?: React.ReactNode;
    funcion: () => void;
    buscador: string;
    setBuscador: (texto: string) => void;
}

export const Cabecera = ({titulo, descripcion, textoBoton, children, funcion, buscador, setBuscador}: Props) => {
  return (
        <div className="bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100">{titulo}</h1>
                    <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 mt-0.5">{descripcion}</p>
                </div>
                <div className="flex items-center gap-2">
                    {textoBoton && (
                        <button onClick={funcion} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer w-full md:w-auto">
                            <AddIcon className="w-5 h-5" />
                            <span>{textoBoton}</span>
                        </button>
                    )}
                </div>
            </div>
        
            {/* Buscador e Inputs/Filtros */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-zinc-400 w-5 h-5" />
                    <input
                        type="text"
                        value={buscador}
                        onChange={(e) => setBuscador(e.target.value)}
                        placeholder="Buscar por cliente, descripción o vendedor..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder-slate-500 dark:placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                {children && (
                    <div className="w-full sm:w-auto flex items-center shrink-0">
                        {children}
                    </div>
                )}
            </div>
        </div>
  )
}