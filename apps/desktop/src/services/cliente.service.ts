import api from "./api.service";

export const clienteById = async (id: number) => {
    try {
        const { data } = await api.get(`/clientes/${id}`)
        console.log(data)
        return data.data;
    } catch (error) {
        throw error;
    }
}