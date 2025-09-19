import React, { useState } from 'react';

const ImgUT = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file); setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleCancelImage = () => {
        setImageFile(null); setImagePreview(null);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFile) {
            console.log(imageFile);
            // Upload image first
            const formDataImage = new FormData();
            console.log(formDataImage);
            formDataImage.append("image", imageFile);
            try {
                console.log(formDataImage);
                const imageResponse = await fetch("http://localhost:3000/upload", {
                    method: "POST",
                    body: formDataImage,
                });
                console.log(imageResponse);
                const imageData = await imageResponse.json();
                console.log(imageData);
            } catch (error) {
                console.error("Error during upload:", error);
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            {!imageFile && (
                <>
                    <label className="btn btn-block">
                        Select Image
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </label>
                </>
            )}
            {imagePreview && (
                <div className="card w-96 bg-base-100 shadow-xl mx-auto">
                    <figure>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="rounded-t-lg max-h-60 object-cover"
                        />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">Image Preview</h2>
                        <div className="card-actions justify-end gap-2">
                            <button type="button" className="btn btn-error text-white" onClick={handleCancelImage}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <button type='submit'>Submit</button>
        </form>
    );
};
export default ImgUT;