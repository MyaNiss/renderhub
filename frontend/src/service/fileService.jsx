import apiClient from "../api/apiClient.jsx";


export const fileAPI = {
    uploadQuillImage: async (formData) => {
        const response = await apiClient.post('/file/upload/quill', formData,
            {
                headers: {
                    contentType: "multipart/form-data",
                }
            });
        return response.data;
    }
}