<template>
  <div class="min-h-screen bg-brandLight text-slate-900">
    <!-- Success/Error Message Display -->
    <div v-if="showMessageFlag" class="fixed left-1/2 top-24 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 px-4 py-3 text-center text-sm rounded-2xl sm:top-32 sm:px-6 sm:text-base sm:rounded-full shadow-2xl text-white font-medium border-2 border-white/20 backdrop-blur-sm" :class="message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'">
      {{ message.text }}
    </div>

    <div class="sticky top-0 z-50">
      <div class="bg-brand py-1 text-center text-xs text-white sm:py-2 sm:text-sm">Chào mừng bạn đến với cửa hàng tạp hoá Ngọc Hoàng</div>

      <header class="container mx-auto bg-white px-4 py-3 sm:px-6 sm:py-6">
        <div class="grid items-center gap-2 sm:gap-4 lg:grid-cols-[1.3fr_2fr_1fr]">
          <div>
            <h1 class="text-xl font-bold text-brandDark sm:text-3xl">Tạp Hoá Ngọc Hoàng</h1>
            <p class="mt-1 hidden text-sm text-slate-600 sm:block">Tạp hoá, thức uống, bia, nước ngọt, bàn chải, gia vị....</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <input
                v-model="searchKeyword"
                type="search"
                placeholder="Tìm sản phẩm..."
                class="w-full rounded-full border border-slate-200 bg-white px-3 py-2.5 pr-10 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 sm:px-4 sm:py-3 sm:pr-12"
              />
              <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
            <button
              type="button"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 md:hidden"
              :aria-expanded="isMobileMenuOpen"
              aria-label="Mo menu danh muc"
            >
              <span class="flex flex-col gap-1">
                <span class="block h-0.5 w-4 bg-current"></span>
                <span class="block h-0.5 w-4 bg-current"></span>
                <span class="block h-0.5 w-4 bg-current"></span>
              </span>
            </button>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 text-sm sm:justify-end sm:gap-4">
            <button
              @click="showAddModal = true"
              class="rounded-full bg-brand px-3 py-2 text-sm text-white shadow-sm transition hover:bg-brandDark sm:px-4 sm:py-3"
            >
              + Thêm sản phẩm
            </button>
            <div class="hidden rounded-3xl bg-white px-4 py-3 text-slate-700 shadow-sm sm:block">
              <div class="font-semibold">Hotline</div>
              <div>097 113 5767</div>
            </div>
          </div>
        </div>
      </header>

      <nav class="border-t border-b border-white/70 bg-white/80 shadow-sm">
        <div class="container mx-auto px-4 py-2 sm:px-6 sm:py-3">
          <ul class="hidden flex-wrap gap-3 text-sm font-medium text-slate-700 md:flex">
            <li>
              <button @click="selectCategory('all')" :class="navButtonClass('all')">Trang chủ</button>
            </li>
            <li><button @click="selectCategory('do_uong')" :class="navButtonClass('do_uong')">Đồ uống</button></li>
            <li><button @click="selectCategory('mi_goi')" :class="navButtonClass('mi_goi')">Mì - Đồ ăn liền</button></li>
            <li><button @click="selectCategory('banh_keo')" :class="navButtonClass('banh_keo')">Bánh kẹo</button></li>
            <li><button @click="selectCategory('gia_vi')" :class="navButtonClass('gia_vi')">Gia vị</button></li>
            <li><button @click="selectCategory('do_gia_dung')" :class="navButtonClass('do_gia_dung')">Đồ gia dụng</button></li>
          </ul>

          <ul v-if="isMobileMenuOpen" class="mt-3 grid gap-2 md:hidden">
            <li>
              <button @click="selectCategory('all')" :class="[...navButtonClass('all'), 'w-full text-left']">Trang chủ</button>
            </li>
            <li>
              <button @click="selectCategory('do_uong')" :class="[...navButtonClass('do_uong'), 'w-full text-left']">Đồ uống</button>
            </li>
            <li>
              <button @click="selectCategory('mi_goi')" :class="[...navButtonClass('mi_goi'), 'w-full text-left']">Mì - Đồ ăn liền</button>
            </li>
            <li>
              <button @click="selectCategory('banh_keo')" :class="[...navButtonClass('banh_keo'), 'w-full text-left']">Bánh kẹo</button>
            </li>
            <li>
              <button @click="selectCategory('gia_vi')" :class="[...navButtonClass('gia_vi'), 'w-full text-left']">Gia vị</button>
            </li>
            <li>
              <button @click="selectCategory('do_gia_dung')" :class="[...navButtonClass('do_gia_dung'), 'w-full text-left']">Đồ gia dụng</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <main class="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <section class="grid gap-4">
        <article class="rounded-3xl bg-brand p-5 text-white shadow-soft sm:p-8">
          <p class="text-sm uppercase tracking-[0.3em] text-emerald-100">Ưu đãi đặc biệt</p>
          <h2 class="mt-4 text-2xl font-bold sm:text-3xl lg:text-4xl">Mua sắm tạp hoá tiện lợi - giao tận nơi</h2>
          <p class="mt-4 max-w-xl text-base leading-7 text-emerald-100">Khuyến mãi hàng ngày, giá tốt toàn bộ danh mục. Đồ ăn nhanh, nước uống, gia vị, đồ dùng gia đình, đủ loại.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <span class="rounded-full bg-white/10 px-4 py-2">Miễn phí giao đơn 200k+</span>
            <span class="rounded-full bg-white/10 px-4 py-2">Cam kết chính hãng</span>
          </div>
        </article>
      </section>

      <section class="mt-10 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div class="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Địa chỉ cửa hàng</p>
            <h2 class="text-2xl font-bold sm:text-3xl">Bản đồ chỉ đường</h2>
          </div>
          <a
            href="https://maps.app.goo.gl/EikVTb4jdbg6Kho28"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brandDark"
          >
            Mở Google Maps
          </a>
        </div>
        <div class="overflow-hidden rounded-3xl border border-slate-200">
          <iframe
            title="Bản đồ cửa hàng Ngọc Hoàng"
            src="https://maps.google.com/maps?q=15.2081596,108.6600396&z=16&output=embed"
            class="h-[130px] w-full sm:h-[170px]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Sản phẩm bán chạy</p>
            <h2 class="text-3xl font-bold">Ưa chuộng nhất</h2>
          </div>
          <div class="text-sm text-slate-600">Có {{ filteredProducts.length }} sản phẩm phù hợp</div>
        </div>

        <div v-if="featuredProducts.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in featuredProducts"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
        <div v-else class="rounded-3xl bg-white p-6 text-center text-slate-600 shadow-sm">
          Không tìm thấy sản phẩm phù hợp với từ khóa tìm kiếm.
        </div>
      </section>

      <section id="category-do_uong" class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Danh mục</p>
            <h2 class="text-3xl font-bold">Đồ uống</h2>
          </div>
          <button @click="toggleCategory('do_uong')" class="text-brandDark underline">
            {{ activeCategory === 'do_uong' ? '← Quay lại' : 'Xem tất cả' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in sectionProducts('do_uong')"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
      </section>

      <section id="category-mi_goi" class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Danh mục</p>
            <h2 class="text-3xl font-bold">Mì ăn liền</h2>
          </div>
          <button @click="toggleCategory('mi_goi')" class="text-brandDark underline">
            {{ activeCategory === 'mi_goi' ? '← Quay lại' : 'Xem tất cả' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in sectionProducts('mi_goi')"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
      </section>

      <section id="category-banh_keo" class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Danh mục</p>
            <h2 class="text-3xl font-bold">Bánh kẹo</h2>
          </div>
          <button @click="toggleCategory('banh_keo')" class="text-brandDark underline">
            {{ activeCategory === 'banh_keo' ? '← Quay lại' : 'Xem tất cả' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in sectionProducts('banh_keo')"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
      </section>

      <section id="category-gia_vi" class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Danh mục</p>
            <h2 class="text-3xl font-bold">Gia vị</h2>
          </div>
          <button @click="toggleCategory('gia_vi')" class="text-brandDark underline">
            {{ activeCategory === 'gia_vi' ? '← Quay lại' : 'Xem tất cả' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in sectionProducts('gia_vi')"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
      </section>

      <section id="category-do_gia_dung" class="mt-10">
        <div class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-brandDark/70">Danh mục</p>
            <h2 class="text-3xl font-bold">Đồ gia dụng</h2>
          </div>
          <button @click="toggleCategory('do_gia_dung')" class="text-brandDark underline">
            {{ activeCategory === 'do_gia_dung' ? '← Quay lại' : 'Xem tất cả' }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <article
            v-for="product in sectionProducts('do_gia_dung')"
            :key="product.id"
            class="rounded-3xl bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <img :src="product.imageUrl" :alt="product.name" class="h-28 w-full rounded-3xl object-cover sm:h-36 lg:h-40" />
            <div class="mt-2">
              <h3 class="text-sm font-semibold text-slate-800 sm:text-base">{{ product.name }}</h3>
              <p class="mt-1 text-base font-bold text-brandDark sm:text-lg">{{ formatPrice(product.price) }}</p>
            </div>
            <div class="mt-2 flex flex-col gap-1.5 sm:flex-row sm:gap-2">
              <button @click="openEditModal(product)" class="flex-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-sm text-blue-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-blue-100">Chỉnh sửa</button>
              <button @click="openDeleteModal(product)" class="flex-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm text-red-700 sm:px-3 sm:py-2 sm:text-base transition hover:bg-red-100">Xóa</button>
            </div>
          </article>
        </div>
      </section>
    </main>

    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
      <div class="w-full max-w-2xl rounded-[2rem] bg-white p-4 shadow-2xl sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Thêm sản phẩm</h2>
            <p class="mt-1 text-sm text-slate-600">Chỉ admin mới có thể thêm sản phẩm mới.</p>
          </div>
          <button @click="closeModal" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700">Đóng</button>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-6 grid gap-4 sm:grid-cols-2">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Tên sản phẩm</span>
            <input v-model="form.name" type="text" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Giá</span>
            <input v-model="form.price" type="number" min="0" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <label class="space-y-2 sm:col-span-2">
            <span class="text-sm font-medium text-slate-700">Ảnh từ máy</span>
            <input @change="handleFileChange" type="file" accept="image/*" class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white" />
            <p class="text-xs text-slate-500">Chọn ảnh từ máy để thêm sản phẩm.</p>
            <div v-if="form.previewUrl" class="mt-3 max-w-xs overflow-hidden rounded-3xl border border-slate-200">
              <img :src="form.previewUrl" alt="Xem trước ảnh" class="h-36 w-full object-cover" />
            </div>
          </label>

          <div class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Danh mục</span>
            <div class="relative">
              <button
                type="button"
                @click.stop="toggleAddCategoryMenu"
                class="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                :aria-expanded="isAddCategoryOpen"
              >
                <span>{{ getCategoryLabel(form.category) }}</span>
                <span class="text-slate-400">▾</span>
              </button>
              <div v-if="isAddCategoryOpen" class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <button
                  v-for="item in categoryOptions"
                  :key="item.value"
                  type="button"
                  @click.stop="selectAddCategory(item.value)"
                  class="block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-100"
                  :class="form.category === item.value ? 'bg-brandLight text-brandDark font-medium' : 'text-slate-700'"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Admin key</span>
            <input v-model="form.adminKey" type="password" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <div class="sm:col-span-2">
            <div class="flex flex-col gap-2">
              <button type="submit" class="rounded-full bg-brand px-6 py-3 text-white transition hover:bg-brandDark">Lưu sản phẩm</button>
              <p class="text-sm text-slate-500">Mã admin mặc định:</p>
              <p v-if="form.error" class="text-sm text-red-600">{{ form.error }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
      <div class="w-full max-w-xl rounded-[2rem] bg-white p-4 shadow-2xl sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Xác nhận xóa</h2>
            <p class="mt-1 text-sm text-slate-600">Nhập admin key để xóa sản phẩm.</p>
          </div>
          <button @click="closeDeleteModal" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700">Đóng</button>
        </div>

        <form @submit.prevent="handleDelete" class="mt-6 grid gap-4">
          <p class="text-sm text-slate-700">Sản phẩm: <span class="font-semibold">{{ selectedDeleteProduct?.name }}</span></p>
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Admin key</span>
            <input v-model="deleteKey" type="password" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>
          <div class="flex flex-col gap-2">
            <button type="submit" class="rounded-full bg-red-500 px-6 py-3 text-white transition hover:bg-red-600">Xóa sản phẩm</button>
            <p v-if="deleteError" class="text-sm text-red-600">{{ deleteError }}</p>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-3 sm:p-4">
      <div class="w-full max-w-xl rounded-[2rem] bg-white p-4 shadow-2xl sm:p-6">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Chỉnh sửa sản phẩm</h2>
            <p class="mt-1 text-sm text-slate-600">Nhập admin key để chỉnh sửa.</p>
          </div>
          <button @click="closeEditModal" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700">Đóng</button>
        </div>

        <form @submit.prevent="handleEdit" class="mt-6 grid gap-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Tên sản phẩm</span>
            <input v-model="editForm.name" type="text" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Giá</span>
            <input v-model="editForm.price" type="number" min="0" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <div class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Danh mục</span>
            <div class="relative">
              <button
                type="button"
                @click.stop="toggleEditCategoryMenu"
                class="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                :aria-expanded="isEditCategoryOpen"
              >
                <span>{{ getCategoryLabel(editForm.category) }}</span>
                <span class="text-slate-400">▾</span>
              </button>
              <div v-if="isEditCategoryOpen" class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <button
                  v-for="item in categoryOptions"
                  :key="item.value"
                  type="button"
                  @click.stop="selectEditCategory(item.value)"
                  class="block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-100"
                  :class="editForm.category === item.value ? 'bg-brandLight text-brandDark font-medium' : 'text-slate-700'"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Ảnh từ máy</span>
            <input
              @change="handleEditFileChange"
              type="file"
              accept="image/*"
              class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-white"
            />
            <p class="text-xs text-slate-500">Chọn ảnh mới nếu bạn muốn cập nhật ảnh sản phẩm.</p>
            <div v-if="editForm.previewUrl" class="mt-2 max-w-xs overflow-hidden rounded-3xl border border-slate-200">
              <img :src="editForm.previewUrl" alt="Xem trước ảnh sản phẩm" class="h-28 w-full object-cover" />
            </div>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-slate-700">Admin key</span>
            <input v-model="editForm.adminKey" type="password" required class="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </label>

          <div class="flex flex-col gap-2">
            <button type="submit" class="rounded-full bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600">Lưu thay đổi</button>
            <p v-if="editForm.error" class="text-sm text-red-600">{{ editForm.error }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { createProduct, deleteProduct, fetchProducts, updateProduct } from './services/productsApi.js';

export default {
  setup() {
    // Admin key - encoded for obscurity
    const getAdminKey = () => {
      const encoded = 'MTIzNDU2'; // base64 of '123456'
      return atob(encoded);
    };

    const STORAGE_KEY = 'taphoa_products_v2';
    const BACKUP_STORAGE_KEY = 'taphoa_products_backup_v1';
    const ADMIN_KEY = getAdminKey();

    const catalogMeta = ref({ storage: 'unknown' });

    const products = ref([]);
    const searchKeyword = ref('');
    const activeCategory = ref('all');
    const isMobileMenuOpen = ref(false);
    const isAddCategoryOpen = ref(false);
    const isEditCategoryOpen = ref(false);
    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedDeleteProduct = ref(null);
    const deleteKey = ref('');
    const deleteError = ref('');
    const showEditModal = ref(false);
    const selectedEditProduct = ref(null);
    const editForm = ref({
      name: '',
      price: '',
      category: '',
      previewUrl: '',
      file: null,
      adminKey: '',
      error: ''
    });

    const message = ref({
      type: '', // 'success' or 'error'
      text: ''
    });
    const showMessageFlag = ref(false);

    const form = ref({
      name: '',
      price: '',
      previewUrl: '',
      file: null,
      category: 'ban_chay',
      adminKey: '',
      error: ''
    });

    const categoryOptions = [
      { value: 'ban_chay', label: 'Bán chạy' },
      { value: 'do_uong', label: 'Đồ uống' },
      { value: 'mi_goi', label: 'Mì ăn liền' },
      { value: 'banh_keo', label: 'Bánh kẹo' },
      { value: 'gia_vi', label: 'Gia vị' },
      { value: 'do_gia_dung', label: 'Đồ gia dụng' }
    ];

    // Tải danh sách sản phẩm hiện tại từ backend và lưu metadata đi kèm.
    const loadProducts = async () => {
      const result = await fetchProducts();
      products.value = result.items;
      catalogMeta.value = result.meta || { storage: 'unknown' };
    };

    // Đồng bộ danh sách trên UI khi API ghi dữ liệu đã trả về kết quả mới.
    const saveProducts = (updated) => {
      products.value = updated;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Chuyển giá trị category sang label hiển thị.
    const getCategoryLabel = (categoryValue) => {
      return categoryOptions.find((item) => item.value === categoryValue)?.label || 'Chọn danh mục';
    };

    // Mở hoặc đóng dropdown chọn danh mục của form thêm sản phẩm.
    const toggleAddCategoryMenu = () => {
      isAddCategoryOpen.value = !isAddCategoryOpen.value;
      if (isAddCategoryOpen.value) {
        isEditCategoryOpen.value = false;
      }
    };

    // Mở hoặc đóng dropdown chọn danh mục của form chỉnh sửa.
    const toggleEditCategoryMenu = () => {
      isEditCategoryOpen.value = !isEditCategoryOpen.value;
      if (isEditCategoryOpen.value) {
        isAddCategoryOpen.value = false;
      }
    };

    // Gán danh mục được chọn vào form thêm sản phẩm.
    const selectAddCategory = (category) => {
      form.value.category = category;
      isAddCategoryOpen.value = false;
    };

    // Gán danh mục được chọn vào form chỉnh sửa sản phẩm.
    const selectEditCategory = (category) => {
      editForm.value.category = category;
      isEditCategoryOpen.value = false;
    };

    // Đọc danh sách backup local được dùng từ giai đoạn trước khi có backend write.
    const loadBackupProducts = () => {
      const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    };

    // Thêm sản phẩm vào backup local cũ nếu chưa tồn tại.
    const saveToBackupStore = (product) => {
      const backupProducts = loadBackupProducts();
      const existed = backupProducts.some((item) => item.id === product.id);
      if (existed) {
        return;
      }

      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify([product, ...backupProducts]));
    };

    // Đọc file ảnh từ form thêm và tạo preview URL.
    const handleFileChange = (event) => {
      const file = event.target.files?.[0] || null;
      form.value.file = file;
      form.value.previewUrl = '';
      if (!file) {
        return;
      }
      if (!file.type.startsWith('image/')) {
        form.value.error = 'Vui lòng chọn file ảnh.';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        form.value.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    };

    // Đọc file ảnh từ form sửa và tạo preview URL.
    const handleEditFileChange = (event) => {
      const file = event.target.files?.[0] || null;
      editForm.value.file = file;

      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        editForm.value.error = 'Vui lòng chọn file ảnh.';
        return;
      }

      editForm.value.error = '';
      const reader = new FileReader();
      reader.onload = () => {
        editForm.value.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    };

    // Format giá sản phẩm theo kiểu tiền tệ Việt Nam.
    const formatPrice = (value) => {
      return value.toLocaleString('vi-VN') + ' đ';
    };

    // Chuẩn hóa text để tìm kiếm phía client không bị ảnh hưởng bởi dấu.
    const normalizeText = (text = '') => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim()
        .replace(/\s+/g, ' ');
    };

    // Tính khoảng cách chỉnh sửa giữa hai chuỗi.
    const levenshteinDistance = (a, b) => {
      if (!a.length) return b.length;
      if (!b.length) return a.length;

      const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

      for (let i = 0; i <= a.length; i += 1) {
        matrix[i][0] = i;
      }
      for (let j = 0; j <= b.length; j += 1) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          );
        }
      }

      return matrix[a.length][b.length];
    };

    // Kiểm tra tên sản phẩm có khớp với từ khóa tìm kiếm hiện tại hay không.
    const isRelativeNameMatch = (productName, keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      if (!normalizedKeyword) {
        return true;
      }

      const normalizedName = normalizeText(productName);
      return normalizedName.includes(normalizedKeyword);
    };

    // Tạo danh sách sản phẩm đang hiển thị dựa trên bộ lọc hiện tại.
    const filteredProducts = computed(() => {
      const keyword = searchKeyword.value;
      let list = products.value;
      if (activeCategory.value !== 'all') {
        list = list.filter((item) => item.category === activeCategory.value);
      }
      if (keyword.trim()) {
        list = list.filter((item) => isRelativeNameMatch(item.name, keyword));
      }
      return list;
    });

    // Chọn các sản phẩm sẽ hiển thị ở khu vực nổi bật.
    const featuredProducts = computed(() => {
      const keyword = searchKeyword.value.trim();
      if (keyword) {
        return filteredProducts.value;
      }

      const sorted = [...products.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sorted.slice(0, 4);
    });

    // Trả về danh sách sản phẩm hiển thị trong từng section danh mục.
    const sectionProducts = (category) => {
      const keyword = searchKeyword.value;
      let list = products.value.filter((item) => item.category === category);
      if (activeCategory.value === category && keyword.trim()) {
        list = list.filter((item) => isRelativeNameMatch(item.name, keyword));
      }
      return activeCategory.value === category ? list : list.slice(0, 4);
    };

    // Bật hoặc tắt bộ lọc theo danh mục.
    const toggleCategory = (category) => {
      activeCategory.value = activeCategory.value === category ? 'all' : category;
    };

    // Kích hoạt danh mục và cuộn đến section tương ứng khi cần.
    const selectCategory = (category) => {
      activeCategory.value = category;
      isMobileMenuOpen.value = false;
      if (category === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const element = document.getElementById(`category-${category}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 0);
      }
    };

    // Mở modal xác nhận xóa cho một sản phẩm cụ thể.
    const openDeleteModal = (product) => {
      selectedDeleteProduct.value = product;
      deleteKey.value = '';
      deleteError.value = '';
      showDeleteModal.value = true;
    };

    // Đóng modal xác nhận xóa và reset state liên quan.
    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      selectedDeleteProduct.value = null;
      deleteKey.value = '';
      deleteError.value = '';
    };

    // Hiển thị thông báo thành công hoặc lỗi trong thời gian ngắn.
    const showMessage = (type, text) => {
      message.value = { type, text };
      showMessageFlag.value = true;
      console.log('Showing message:', type, text); // Debug log
      // Clear message after 3 seconds
      setTimeout(() => {
        showMessageFlag.value = false;
        message.value = { type: '', text: '' };
        console.log('Message cleared'); // Debug log
      }, 3000);
    };

    // Hiển thị thông báo tạm cho các luồng ghi dữ liệu chưa bật.
    const showWritePendingMessage = (actionName) => {
      showMessage('error', `${actionName} sẽ được bật sau khi xong API ghi dữ liệu.`);
    };

    // Xóa sản phẩm đang chọn thông qua backend API.
    const handleDelete = async () => {
      deleteError.value = '';
      if (deleteKey.value !== ADMIN_KEY) {
        deleteError.value = 'Admin key không đúng. Vui lòng thử lại.';
        showMessage('error', 'Xóa sản phẩm thất bại: Admin key không đúng!');
        return;
      }
      if (!selectedDeleteProduct.value) {
        deleteError.value = 'Không tìm thấy sản phẩm để xóa.';
        showMessage('error', 'Xóa sản phẩm thất bại: Không tìm thấy sản phẩm!');
        return;
      }

      try {
        const deletedProduct = await deleteProduct({
          id: selectedDeleteProduct.value.id,
          adminKey: deleteKey.value
        });
        products.value = products.value.filter((item) => item.id !== deletedProduct.id);
        closeDeleteModal();
        showMessage('success', `Đã xóa "${deletedProduct.name}" thành công!`);
      } catch (error) {
        deleteError.value = error.message || 'Không thể xóa sản phẩm.';
        showMessage('error', `Xóa sản phẩm thất bại: ${deleteError.value}`);
      }
    };

    // Mở modal chỉnh sửa và điền sẵn dữ liệu sản phẩm vào form.
    const openEditModal = (product) => {
      selectedEditProduct.value = product;
      editForm.value = {
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        previewUrl: product.imageUrl,
        file: null,
        adminKey: '',
        error: ''
      };
      showEditModal.value = true;
    };

    // Đóng modal chỉnh sửa và reset state của form sửa.
    const closeEditModal = () => {
      showEditModal.value = false;
      isEditCategoryOpen.value = false;
      selectedEditProduct.value = null;
      editForm.value = {
        name: '',
        price: '',
        category: 'ban_chay',
        previewUrl: '',
        file: null,
        adminKey: '',
        error: ''
      };
    };

    // Cập nhật sản phẩm đang chọn thông qua backend API.
    const handleEdit = async () => {
      editForm.value.error = '';
      if (!editForm.value.name.trim()) {
        editForm.value.error = 'Tên sản phẩm không được để trống.';
        showMessage('error', 'Chỉnh sửa sản phẩm thất bại: Tên sản phẩm không được để trống!');
        return;
      }
      if (!editForm.value.price || Number(editForm.value.price) <= 0) {
        editForm.value.error = 'Giá sản phẩm phải lớn hơn 0.';
        showMessage('error', 'Chỉnh sửa sản phẩm thất bại: Giá sản phẩm không hợp lệ!');
        return;
      }
      if (editForm.value.adminKey !== ADMIN_KEY) {
        editForm.value.error = 'Admin key không đúng. Vui lòng thử lại.';
        showMessage('error', 'Chỉnh sửa sản phẩm thất bại: Admin key không đúng!');
        return;
      }
      if (!selectedEditProduct.value) {
        editForm.value.error = 'Không tìm thấy sản phẩm để chỉnh sửa.';
        showMessage('error', 'Chỉnh sửa sản phẩm thất bại: Không tìm thấy sản phẩm!');
        return;
      }

      try {
        const updatedProduct = await updateProduct({
          id: selectedEditProduct.value.id,
          name: editForm.value.name.trim(),
          price: Number(editForm.value.price),
          category: editForm.value.category,
          imageUrl: editForm.value.previewUrl.trim(),
          adminKey: editForm.value.adminKey
        });

        products.value = products.value.map((item) => {
          if (item.id === updatedProduct.id) {
            return updatedProduct;
          }

          return item;
        });
        closeEditModal();
        showMessage('success', `Đã cập nhật "${updatedProduct.name}" thành công!`);
      } catch (error) {
        editForm.value.error = error.message || 'Không thể chỉnh sửa sản phẩm.';
        showMessage('error', `Chỉnh sửa sản phẩm thất bại: ${editForm.value.error}`);
      }
    };

    // Tạo sản phẩm mới thông qua backend API.
    const handleSubmit = async () => {
      form.value.error = '';
      if (!form.value.name.trim()) {
        form.value.error = 'Tên sản phẩm không được để trống.';
        showMessage('error', 'Thêm sản phẩm thất bại: Tên sản phẩm không được để trống!');
        return;
      }
      if (!form.value.price || Number(form.value.price) <= 0) {
        form.value.error = 'Giá sản phẩm phải lớn hơn 0.';
        showMessage('error', 'Thêm sản phẩm thất bại: Giá sản phẩm không hợp lệ!');
        return;
      }
      if (form.value.adminKey !== ADMIN_KEY) {
        form.value.error = 'Admin key không đúng. Vui lòng thử lại.';
        showMessage('error', 'Thêm sản phẩm thất bại: Admin key không đúng!');
        return;
      }

      try {
        const createdProduct = await createProduct({
          name: form.value.name.trim(),
          price: Number(form.value.price),
          imageUrl: form.value.previewUrl,
          category: form.value.category,
          adminKey: form.value.adminKey
        });

        products.value = [createdProduct, ...products.value];
        form.value = {
          name: '',
          price: '',
          previewUrl: '',
          file: null,
          category: 'ban_chay',
          adminKey: '',
          error: ''
        };
        showAddModal.value = false;
        showMessage('success', `Đã thêm "${createdProduct.name}" thành công!`);
      } catch (error) {
        form.value.error = error.message || 'Không thể thêm sản phẩm.';
        showMessage('error', `Thêm sản phẩm thất bại: ${form.value.error}`);
      }
    };

    // Đóng modal thêm sản phẩm và xóa lỗi tạm trên form.
    const closeModal = () => {
      showAddModal.value = false;
      isAddCategoryOpen.value = false;
      form.value.error = '';
    };

    // Trả về class cho nút điều hướng theo trạng thái danh mục hiện tại.
    const navButtonClass = (category) => {
      return [
        'rounded-full px-4 py-2 transition',
        activeCategory.value === category ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
      ];
    };

    onMounted(loadProducts);

    // Chuyển id danh mục sang tiêu đề hiển thị trên giao diện.
    const getCategoryName = (category) => {
      const categoryMap = {
        'do_uong': 'Đồ uống',
        'mi_goi': 'Mì - Đồ ăn liền',
        'banh_keo': 'Bánh kẹo',
        'gia_vi': 'Gia vị',
        'do_gia_dung': 'Đồ gia dụng'
      };
      return categoryMap[category] || 'Tất cả sản phẩm';
    };

    return {
      searchKeyword,
      activeCategory,
      isMobileMenuOpen,
      isAddCategoryOpen,
      isEditCategoryOpen,
      showAddModal,
      showDeleteModal,
      selectedDeleteProduct,
      deleteKey,
      deleteError,
      showEditModal,
      selectedEditProduct,
      editForm,
      form,
      message,
      showMessageFlag,
      categoryOptions,
      getCategoryLabel,
      filteredProducts,
      featuredProducts,
      sectionProducts,
      selectCategory,
      toggleCategory,
      openDeleteModal,
      closeDeleteModal,
      handleDelete,
      toggleAddCategoryMenu,
      toggleEditCategoryMenu,
      selectAddCategory,
      selectEditCategory,
      openEditModal,
      closeEditModal,
      handleEdit,
      handleSubmit,
      handleFileChange,
      handleEditFileChange,
      closeModal,
      formatPrice,
      navButtonClass,
      getCategoryName
    };
  }
};
</script>

<style scoped>
@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
}

.animate-fade-in-out {
  animation: fade-in-out 3s ease-in-out;
}
</style>
