import { ID, storage } from '@/appwrith'

const uploadImge = async (file: File) => {
    if (!file) return

    const fileUplosaded = await storage.createFile("64eff45e31afe0a9a9c4", ID.unique(), file)

    return fileUplosaded
}
export default uploadImge;
