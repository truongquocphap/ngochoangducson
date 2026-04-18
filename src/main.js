/**
 * ============================================================
 * ĐIỂM KHỞI ĐỘNG ỨNG DỤNG (Entry Point)
 * ============================================================
 * File này được Vite nạp đầu tiên khi ứng dụng chạy.
 * Nhiệm vụ: tạo Vue app từ component App.vue rồi gắn vào
 * phần tử #app trong file index.html.
 * ============================================================
 */
import { createApp } from 'vue';
// Component gốc chứa toàn bộ giao diện và logic
import App from './App.vue';
// CSS toàn cục (bao gồm Tailwind CSS directives)
import './index.css';

// Tạo instance Vue và mount vào <div id="app"> trong index.html
createApp(App).mount('#app');
