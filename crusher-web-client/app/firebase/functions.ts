import {getFunctions, httpsCallable} from 'firebase/functions';
import {app} from './firebase'; // Import the initialized app
import { functions } from './firebase';


const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export async function uploadVideo(file: File) {
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split('.').pop()
  });
  // upload the file via the signed url
  const uploadResult = await fetch(response?.data?.url, {
    method: 'PUT',
    body: file,
    headers: {
        'Content-Type': file.type
    }
  });
  return uploadResult;
}

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

export async function getVideos() {
  const response: any = await getVideosFunction();
  return response.data as Video[];
}