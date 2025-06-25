import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { uploadToVercelBlob } from "@/lib/uploadToVercelBlob";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

export type ShadcnImageUploadFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  maxFileSize?: string;
  acceptedFileTypes?: string[];
  allowImageEdit?: boolean;
  allowImagePreview?: boolean;
  allowFileTypeValidation?: boolean;
  allowFileSizeValidation?: boolean;
};

export function ShadcnImageUploadField<T extends FieldValues>({
  form,
  name,
  label,
  disabled = false,
  maxFileSize = "1MB",
  acceptedFileTypes = ["image/*"],
  allowImageEdit = true,
  allowImagePreview = true,
  allowFileTypeValidation = true,
  allowFileSizeValidation = true,
}: ShadcnImageUploadFieldProps<T>) {
  // FilePond state for preview
  const initialUrl = form.getValues(name);
  const [filePondFiles, setFilePondFiles] = React.useState<any[]>(
    initialUrl
      ? [
          {
            source: initialUrl,
            options: { type: "local" },
          },
        ]
      : []
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div>
              <FilePond
                files={filePondFiles}
                onupdatefiles={setFilePondFiles}
                allowMultiple={false}
                maxFiles={1}
                acceptedFileTypes={acceptedFileTypes}
                labelIdle="Drag & Drop your image or <span class='filepond--label-action'>Browse</span>"
                maxFileSize={maxFileSize}
                allowImageEdit={allowImageEdit}
                allowImagePreview={allowImagePreview}
                allowFileTypeValidation={allowFileTypeValidation}
                allowFileSizeValidation={allowFileSizeValidation}
                disabled={disabled}
                server={{
                  process: async (fieldName, file, metadata, load, error, progress, abort) => {
                    try {
                      let uploadFile = file;
                      if (!(file instanceof File)) {
                        uploadFile = Object.assign(
                          new File([file], file.name, {
                            type: file.type,
                            lastModified: file.lastModified || Date.now(),
                          }),
                          { webkitRelativePath: "" }
                        );
                      }
                      const url = await uploadToVercelBlob(uploadFile as File);
                      field.onChange(url);
                      load(url);
                    } catch (err) {
                      error("Failed to upload image.");
                    }
                  },
                  revert: (uniqueFileId, load, error) => {
                    field.onChange("");
                    load();
                  },
                }}
              />
              {form.watch(name) && (
                <img
                  src={form.watch(name)}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover mt-2"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
