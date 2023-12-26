"use server";

export const handler = (data: { fileName: string; fileSize: string }) => {
    console.log("Hello world from server");
    console.log(data);
};
