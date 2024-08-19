<template>
  <div class="write-container">
    <div class="header">
      <!-- 제목 입력 -->
      <input type="text" v-model="title" placeholder="제목을 입력하세요" class="title-input" />
    </div>

    <div class="content-container">
      <div class="editor-section" @drop.prevent="handleDrop" @dragover.prevent>
        <!-- 본문 입력 영역 -->
        <textarea ref="contentTextarea" v-model="content" placeholder="내용을 입력하세요" class="content-textarea"></textarea>
      </div>

      <div class="preview-section">
        <!-- 본문 미리보기 영역 -->
        <div class="content-preview" v-html="compiledMarkdown"></div>
      </div>
    </div>

    <div class="thumbnail-upload">
      <label for="thumbnail">썸네일 이미지 업로드</label>
      <input type="file" @change="handleThumbnailUpload" id="thumbnail" class="file-input" />
      <div v-if="thumbnail" class="thumbnail-preview">
        <p>현재 이미지:</p>
        <img :src="thumbnail" alt="Thumbnail preview" class="thumbnail-image" />
      </div>
    </div>

    <div class="tags-input">
      <label for="tags">태그 입력 (쉼표로 구분):</label>
      <input type="text" v-model="tagsInput" @input="updateTags" placeholder="예: 영어, 자바, 구현" />
      <div class="tags-preview">
        <span v-for="(tag, index) in tags" :key="index" class="tag-item">{{ tag.content }}</span>
      </div>
    </div>

    <div class="actions">
      <router-link to="/" class="back-button">취소</router-link>
      <button @click="savePost" class="save-button">출간하기</button>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import axiosInstance from '@/plugins/axios';

export default {
  name: 'Write',
  data() {
    return {
      title: '',
      content: '',
      thumbnail: '',
      previousThumbnail: '',
      tagsInput: '', // 태그 입력을 위한 데이터
      tags: [] // 태그 객체 배열
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.content);
    }
  },
  methods: {
    updateTags() {
      this.tags = this.tagsInput.split(',').map(tag => ({ content: tag.trim() }));
    },
    async handleThumbnailUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (this.previousThumbnail) {
        await this.deletePreviousThumbnail();
      }

      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.thumbnail = response.data.result.fileUrl;
        this.previousThumbnail = this.thumbnail;
        console.log('새로운 썸네일 URL:', this.thumbnail);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      }
    },
    async deletePreviousThumbnail() {
      try {
        await axiosInstance.delete('/images', {
          params: { fileUrl: this.previousThumbnail }
        });
        this.previousThumbnail = '';
      } catch (error) {
        console.error('이전 썸네일 삭제 중 오류가 발생했습니다:', error);
      }
    },
    async handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = response.data.result.fileUrl;
        this.insertImageAtCursor(imageUrl);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      }
    },
    insertImageAtCursor(imageUrl) {
      const textarea = this.$refs.contentTextarea;
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;

      const textBefore = this.content.substring(0, startPos);
      const textAfter = this.content.substring(endPos, this.content.length);

      this.content = `${textBefore}<img src="${imageUrl}" alt="이미지"/>\n${textAfter}`;
    },
    async savePost() {
      try {
        await axiosInstance.post('/posts', {
          title: this.title,
          content: this.content,
          thumbnail: this.thumbnail,
          tags: this.tags // 태그 추가
        });

        this.$router.push('/');
      } catch (error) {
        console.error('게시글 작성 중 오류가 발생했습니다:', error);
      }
    }
  }
};
</script>

<style scoped>
.write-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.write-box {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.title-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.content-container {
  display: flex;
  flex-grow: 1;
  gap: 20px;
  min-height: auto;
}

.editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 10px;
  text-align: left;
}

.preview-section {
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  overflow-y: auto;
  text-align: left;
  min-height: auto;
}

.thumbnail-upload {
  margin-top: 20px;
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

.tags-input {
  margin-top: 20px;
}

.tags-preview {
  margin-top: 10px;
}

.tag-item {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px;
  margin-right: 5px;
  font-size: 0.9em;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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
</style>
