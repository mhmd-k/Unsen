import * as React from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Props = {
  files: File[];
  setFiles: (files: File[]) => void;
  primaryIndex: number;
  setPrimaryIndex: (index: number) => void;
};

const ProductImageUpload = ({
  files,
  setFiles,
  primaryIndex,
  setPrimaryIndex,
}: Props) => {
  const onFileReject = React.useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name}" was rejected`,
    });
  }, []);

  return (
    <div className="space-y-2">
      <FileUpload
        accept="image/*"
        maxFiles={5}
        maxSize={2 * 1024 * 1024}
        value={files}
        onValueChange={setFiles}
        onFileReject={onFileReject}
        multiple
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-medium text-sm">Upload product images</p>
            <p className="text-muted-foreground text-xs">
              Min 1 – Max 5 images (2MB each)
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
            <FileUploadItem
              key={index}
              value={file}
              className={`${index === primaryIndex && "bg-primary/20"}`}
            >
              <FileUploadItemPreview />
              <FileUploadItemMetadata />

              <div className="flex items-center gap-2">
                {index !== primaryIndex && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => setPrimaryIndex(index)}
                        title="Set as primary"
                      >
                        <Star className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set as the primary image</p>
                    </TooltipContent>
                  </Tooltip>
                )}

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
    </div>
  );
};

export default ProductImageUpload;
