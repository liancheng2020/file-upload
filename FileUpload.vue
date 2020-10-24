<template>
  <div class="file-upload">
    <i class="iconfont ic-ldj-add"></i>
    <span class="file-upload-text">上传文件</span>
    <input type="file" :id="id" @change="upload" />
  </div>
</template>
<script src="./FileUpload.ts" lang="ts"></script>

<style lang="scss">
  .file-upload {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    margin: 10px 16px 0 0;
    display: inline-block;
    .ic-ldj-add {
      font-size: 28px;
      font-weight: 500;
      color: #8c939d;
      width: 80px;
      height: 28px;
      line-height: 56px;
      text-align: center;
    }
    .file-upload-text {
      width: 80px;
      height: 12px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      margin: 0 0 0 15px;
    }
    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      padding: 0;
      top: 0;
      left: 0;
    }
  }
</style>
