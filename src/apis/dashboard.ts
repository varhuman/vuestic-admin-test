// api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8079'; // 你的后端地址

export const getTemplateByName = async (templateName: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/get1`, {
            params: {
                templatename: templateName,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getTemplateName = async () => {
    try {
        const response = await axios.get(`/api/getTemplateName`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const submit = async (templateName: string, imageFile: File) => {

    console.log("请求发送：templatename=", templateName, "  imageFile=", imageFile)
    // 创建一个新的 FormData 实例
    const formData = new FormData();

    // 添加模板名称和图像文件到表单数据
    formData.append('templateName', templateName);
    formData.append('image', imageFile);

    try {
        // 发送 POST 请求
        const response = await axios.post('/api/submit', formData);
        console.log(response);
        // 如果返回的数据有问题，抛出一个错误
        if (!response.data || !response.data.images || response.data.images.length === 0) {
            throw new Error('Invalid response from server');
        }
        let res:HTMLImageElement[] = []
        // 对于返回的每一个 base64 编码的图像，创建一个新的 Image 对象
        const images = response.data.images.map((base64: string) => {
            const img = new Image();
            img.src = 'data:image/png;base64,' + base64;
            res.push(img)
        });
        return res;
    } catch (error) {
        console.error('Error:', error);
    }
}