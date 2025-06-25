import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Contact } from "@/lib/schema";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import { uploadToVercelBlob } from "@/lib/uploadToVercelBlob";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

interface ContactFormProps {
  initial?: Partial<Contact>;
  onSubmit: (data: Partial<Contact>) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export default function ContactForm({
  initial = {},
  onSubmit,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState(initial.first_name || "");
  const [lastName, setLastName] = useState(initial.last_name || "");
  const [dateOfBirth, setDateOfBirth] = useState(initial.date_of_birth || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(initial.profile_picture_url || "");
  const [genderId, setGenderId] = useState(initial.gender_id ? String(initial.gender_id) : "");
  const [error, setError] = useState<string | null>(null);
  const [filePondFiles, setFilePondFiles] = useState<any[]>(
    initial.profile_picture_url
      ? [
          {
            source: initial.profile_picture_url,
            options: { type: "local" },
          },
        ]
      : []
  );

  return (
    <form
      className="space-y-4 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        if (!firstName.trim() || !lastName.trim()) {
          setError("First name and last name are required.");
          return;
        }
        try {
          await onSubmit({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            date_of_birth: dateOfBirth || undefined,
            profile_picture_url: profilePictureUrl || undefined,
            gender_id: genderId ? Number(genderId) : undefined,
          });
        } catch (err: any) {
          setError(err?.message || "Failed to save contact.");
        }
      }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          maxLength={100}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Gender ID</label>
        <Input value={genderId} onChange={(e) => setGenderId(e.target.value)} type="number" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <Input
          value={dateOfBirth || ""}
          onChange={(e) => setDateOfBirth(e.target.value)}
          type="date"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Profile Picture</label>
        <FilePond
          files={filePondFiles}
          onupdatefiles={setFilePondFiles}
          allowMultiple={false}
          maxFiles={1}
          acceptedFileTypes={["image/*"]}
          labelIdle="Drag & Drop your image or <span class='filepond--label-action'>Browse</span>"
          maxFileSize="1MB"
          allowImageEdit={true}
          allowImagePreview={true}
          allowFileTypeValidation={true}
          allowFileSizeValidation={true}
          server={{
            process: async (fieldName, file, metadata, load, error, progress, abort) => {
              try {
                let uploadFile = file;
                // FilePond may provide a Blob, convert to File if needed
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
                setProfilePictureUrl(url);
                load(url);
              } catch (err: any) {
                error(err?.message || "Failed to upload image.");
              }
            },
            revert: (uniqueFileId, load, error) => {
              setProfilePictureUrl("");
              load();
            },
          }}
        />
        {profilePictureUrl && (
          <img
            src={profilePictureUrl}
            alt="Profile Preview"
            className="w-16 h-16 rounded-full object-cover mt-2"
          />
        )}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading} className="min-w-[100px]">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
