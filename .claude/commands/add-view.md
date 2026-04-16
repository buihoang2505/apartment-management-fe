Thêm màn hình mới vào FE theo đúng convention.

Nếu chưa đủ thông tin, hỏi trước:
1. Tên màn hình? (vd: ApartmentList, ApartmentDetail)
2. API endpoint nào cần gọi?
3. Có ảnh thiết kế không? (kéo vào chat)

## Thứ tự tạo file

1. `src/services/<feature>Service.js` — gọi API
```js
import axios from '@/plugins/axios'

export const apartmentService = {
  getAll: (params) => axios.get('/apartments', { params }),
  getById: (id) => axios.get(`/apartments/${id}`),
  create: (data) => axios.post('/apartments', data),
  update: (id, data) => axios.put(`/apartments/${id}`, data),
  delete: (id) => axios.delete(`/apartments/${id}`),
}
```

2. `src/stores/<feature>Store.js` — Pinia store
```js
import { defineStore } from 'pinia'
import { apartmentService } from '@/services/apartmentService'

export const useApartmentStore = defineStore('apartment', {
  state: () => ({ items: [], loading: false, error: null }),
  actions: {
    async fetchAll(params) {
      this.loading = true
      try { this.items = await apartmentService.getAll(params) }
      finally { this.loading = false }
    }
  }
})
```

3. `src/views/<Feature>View.vue` — màn hình chính
4. Đăng ký route trong `src/router/index.js`

## Checklist
- [ ] Service gọi đúng endpoint (xem swagger)
- [ ] Store có loading + error state
- [ ] Component dùng Composition API
- [ ] Route được đăng ký
- [ ] Axios base URL đúng (http://localhost:8080/api)
