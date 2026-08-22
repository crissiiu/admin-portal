export interface FileStorageClientPort {
  createSignedUploadUrl(input: { ownerId: string; contentType: string }): Promise<{ uploadUrl: string; fileId: string }>;
}
