<template>
  <div class="edit-post-container" @dragover.prevent @drop.prevent="handleDrop">
    <div class="edit-post-box">
      <h1>게시글 수정하기</h1>
      <input type="text" v-model="title" placeholder="제목을 입력하세요" class="title-input" />
      <input type="text" v-model="description" placeholder="요약을 입력하세요" class="description-input" />

      <div class="markdown-editor">
        <textarea ref="contentTextarea" v-model="content" placeholder="내용을 입력하세요" class="content-textarea"></textarea>
      </div>

      <!-- 썸네일 미리보기 및 이미지 업로드 -->
      <div class="thumbnail-upload">
        <label for="thumbnail">썸네일 이미지 업로드</label>
        <input type="file" @change="handleImageUpload" id="thumbnail" class="file-input" />
        <div v-if="thumbnail" class="thumbnail-preview">
          <p>현재 이미지:</p>
          <img :src="thumbnail" alt="Thumbnail preview" class="thumbnail-image" />
        </div>
      </div>

      <div class="actions">
        <router-link to="/" class="back-button">취소</router-link>
        <button @click="updatePost" class="save-button">수정 완료</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/plugins/axios';

export default {
  name: 'EditPost',
  data() {
    return {
      title: '',
      description: '',
      content: '',
      thumbnail: '', // 새롭게 업로드된 썸네일 이미지 URL
      previousThumbnail: '', // 이전 썸네일 이미지 URL
      postId: null,
      selectedImage: null, // 선택된 이미지 요소 참조
    };
  },
  created() {
    this.postId = this.$route.params.postId;
    this.fetchPostDetails();
  },
  methods: {
    async fetchPostDetails() {
      try {
        const response = await axiosInstance.get(`/posts/${this.postId}`);
        const { title, description, content, thumbnail } = response.data.result;
        this.title = title;
        this.description = description;
        this.content = content;
        this.thumbnail = thumbnail;
        this.previousThumbnail = thumbnail;
      } catch (error) {
        console.error('게시글 정보를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // 기존 이미지가 있으면 삭제
      if (this.previousThumbnail) {
        await this.deletePreviousImage();
      }

      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.thumbnail = response.data.result.fileUrl;
        console.log('새로운 썸네일 URL:', this.thumbnail);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      }
    },
    async deletePreviousImage() {
      try {
        await axiosInstance.delete('/images', {
          params: {
            fileUrl: this.previousThumbnail
          }
        });
        console.log('이전 썸네일 삭제 완료:', this.previousThumbnail);
        this.previousThumbnail = '';
      } catch (error) {
        console.error('이전 썸네일 삭제 중 오류가 발생했습니다:', error);
      }
    },
    async handleDrop(event) {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        await this.uploadImage(file);
      }
    },
    async uploadImage(file) {
      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = response.data.result.fileUrl;
        this.insertImageUrlAtCursor(imageUrl);
        console.log('이미지 URL:', imageUrl);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      }
    },
    insertImageUrlAtCursor(imageUrl) {
      const textarea = this.$refs.contentTextarea;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = this.content.slice(0, cursorPosition);
      const textAfterCursor = this.content.slice(cursorPosition);

      this.content = `${textBeforeCursor}![image](${imageUrl})${textAfterCursor}`;
      this.$nextTick(() => {
        const insertedImage = this.$refs.contentTextarea.querySelector(`img[src="${imageUrl}"]`);
        this.makeImageResizable(insertedImage);
      });
    },
    makeImageResizable(imageElement) {
      if (imageElement) {
        imageElement.style.resize = 'both';
        imageElement.style.overflow = 'auto';
      }
    },
    async updatePost() {
      try {
        await axiosInstance.patch(`/posts/${this.postId}`, {
          title: this.title,
          description: this.description,
          content: this.content,
          thumbnail: this.thumbnail
        });

        this.$router.push(`/post/${this.postId}`);
      } catch (error) {
        console.error('게시글 수정 중 오류가 발생했습니다:', error);
      }
    }
  }
}
</script>

<style scoped>
.edit-post-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.edit-post-box {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 800px;
}

.title-input,
.description-input,
.content-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.content-textarea {
  height: 400px;
  resize: none;
}

.thumbnail-upload {
  margin-bottom: 15px;
}

.file-input {
  width: 100%;
}

.thumbnail-preview {
  margin-top: 15px;
}

.thumbnail-image {
  max-width: 100px;
  max-height: 100px;
  object-fit: cover;
  margin-top: 10px;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.back-button,
.save-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  color: white;
}

.back-button {
  background-color: #ccc;
}

.back-button:hover {
  background-color: #aaa;
}

.save-button {
  background-color: #2db400;
}

.save-button:hover {
  background-color: #28a700;
}

img[resizable] {
  resize: both;
  overflow: auto;
}
</style>
