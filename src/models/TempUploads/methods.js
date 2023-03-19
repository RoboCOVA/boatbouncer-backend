export async function createTempUpload() {
  const tempUpload = await this.save();
  return tempUpload;
}
