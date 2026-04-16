# Apartment Management — Frontend

## Tổng quan
Admin web app quản lý chung cư. Vue 3 SPA.
Repo FE: https://github.com/buihoang2505/apartment-management-fe
Repo BE: https://github.com/buihoang2505/apartment-management-be

## Tech Stack
- Vue 3 + Vite
- Pinia (state management)
- Vue Router
- Axios (HTTP client)
- TailwindCSS

## API Backend
- Local: http://localhost:8080/api
- Swagger: http://localhost:8080/swagger-ui/index.html
- Auth: JWT Bearer token (lưu trong localStorage key: `token`)

## UI Design
- Theme: dark navy
- Layout: card-based, bottom navigation bar
- Ảnh thiết kế: docs/designs/

## Project Structure
```
frontend/
├── src/
│   ├── views/        ← màn hình (ApartmentListView.vue...)
│   ├── components/   ← component tái sử dụng
│   ├── services/     ← gọi API (apartmentService.js...)
│   ├── stores/       ← Pinia stores
│   ├── router/       ← Vue Router config
│   └── assets/
└── docs/
    └── designs/      ← ảnh thiết kế từ Stitch
```

## Conventions
- Composition API — không dùng Options API
- Gọi API qua `src/services/` — không gọi axios trực tiếp trong component
- Component: PascalCase | File: kebab-case
- Store tên: `use<Feature>Store` (vd: useApartmentStore)
- Service tên: `<feature>Service` (vd: apartmentService)

## Màn hình cần implement
- Dashboard — thống kê, tăng trưởng
- Danh sách căn hộ — list, filter, phân trang
- Chi tiết căn hộ — thông tin đầy đủ, gallery ảnh
- Quản lý Zone / Portfolio
- Login

## Branching
- `main` — production
- `develop` — working branch
