import {getFunctions, httpsCallable} from 'firebase/functions';
import {app} from './firebase'; // Import the initialized app



const functions = getFunctions(app);

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');

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
