import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useState } from "react";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const MAX_IMAGE_SIZE = 1024 * 1024 * 2; // 2MB

const UploadImagesDialog = ({ maxFiles }: { maxFiles: number }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const productId = useParams().id || "";

  const onFileReject = (file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name}" was rejected`,
    });
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      await axiosPrivate.post(`/products/${productId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Images uploaded successfully");
      setFiles([]);
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["product-by-id", productId],
      });
    } catch (error) {
      toast.error("Failed to upload images");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="cursor-pointer flex items-center justify-center border-2 border-gray-300 rounded-md h-48 w-full text-gray-400 hover:border-gray-400"
          disabled={files.length >= maxFiles}
        >
          <PlusIcon className="w-20 h-20 text-gray-400 border-2 border-gray-300 rounded-full" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-fit md:min-w-xl">
        <DialogHeader>
          <DialogTitle>Upload New Images</DialogTitle>
        </DialogHeader>

        <FileUpload
          accept="image/*"
          maxFiles={maxFiles}
          maxSize={MAX_IMAGE_SIZE}
          value={files}
          onValueChange={setFiles}
          onFileReject={onFileReject}
          multiple
        >
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="font-medium text-sm">Upload product images</p>
              <p className="text-muted-foreground text-xs">
                Min 1 – Max {maxFiles} images (2MB each)
              </p>
            </div>
            <FileUploadTrigger asChild>
              <Button size="sm" className="mt-3">
                Select Images
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>

          <FileUploadList>
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />

                <div className="flex items-center gap-2">
                  <FileUploadItemDelete asChild>
                    <Button variant="ghost" size="icon">
                      ×
                    </Button>
                  </FileUploadItemDelete>
                </div>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImagesDialog;
