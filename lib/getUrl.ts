import { storage } from "@/appwrith";
import { Image } from "@/tyoing";

const getUrl = async (image: Image) => { 
    return storage.getFilePreview(image.bucketId, image.fileId)
}
export default getUrl
