<template>
  <div class="write-container">
    <div class="write-box">
      <h1>게시글 작성하기</h1>
      <input type="text" v-model="title" placeholder="제목을 입력하세요" class="title-input" />
      <input type="text" v-model="description" placeholder="요약을 입력하세요" class="description-input" />
      
      <div class="markdown-editor">
        <textarea v-model="content" placeholder="내용을 입력하세요" class="content-textarea"></textarea>
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
        <button @click="savePost" class="save-button">출간하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Write',
  data() {
    return {
      title: '',
      description: '',
      content: '',
      thumbnail: '', // 새롭게 업로드된 썸네일 이미지 URL
      previousThumbnail: '' // 이전 썸네일 이미지 URL
    };
  },
  methods: {
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
        const response = await axios.post('http://localhost:8081/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.thumbnail = response.data.result.fileUrl; // 새 썸네일 URL을 저장
        this.previousThumbnail = this.thumbnail; // 새 URL을 이전 썸네일로 업데이트
        console.log('새로운 썸네일 URL:', this.thumbnail);
      } catch (error) {
        console.error('이미지 업로드 중 오류가 발생했습니다:', error);
      }
    },
    async deletePreviousImage() {
      try {
        await axios.delete('http://localhost:8081/images', {
          params: {
            fileUrl: this.previousThumbnail
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        console.log('이전 썸네일 삭제 완료:', this.previousThumbnail);
        this.previousThumbnail = ''; // 이전 썸네일 URL 초기화
      } catch (error) {
        console.error('이전 썸네일 삭제 중 오류가 발생했습니다:', error);
      }
    },
    async savePost() {
      try {
        await axios.post('http://localhost:8081/posts', {
          title: this.title,
          description: this.description,
          content: this.content,
          thumbnail: this.thumbnail // 새 썸네일 이미지 URL 전달
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        this.$router.push('/'); // 게시글 작성 후 메인 페이지로 리다이렉션
      } catch (error) {
        console.error('게시글 작성 중 오류가 발생했습니다:', error);
      }
    }
  }
}
</script>

<style scoped>
.write-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.write-box {
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
  max-width: 100px; /* 미리보기 이미지의 최대 너비 */
  max-height: 100px; /* 미리보기 이미지의 최대 높이 */
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
</style>
