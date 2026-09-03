/**
 * Tak Luxe Grooming - Core Interactions & Telegram Dispatch
 * Pure Vanilla JavaScript - 100% Ready for Cloudflare Pages Drag & Drop
 */

// Configuration
const CONFIG = {
  shopName: "آرایشگاه تک لوکس گرومینگ (Tak Luxe Grooming)",
  telegramUsername: "TakLuxeGrooming", // Telegram channel or admin ID
  whatsappNumber: "989120000000",      // Semnan branch WhatsApp
  phone: "02188888888",
  address: "استان سمنان، شهر سمنان، خیابان حکیم الهی، حکیم الهی ۳۷",
};

// Convert English digits to Persian digits
function toPersianDigits(num) {
  if (num === null || num === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[d]);
}

// Format price in Tomans with Persian numerals
function formatPrice(amount) {
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "،");
  return toPersianDigits(formatted) + " تومان";
}

// Toast Notification
function showToast(message, duration = 3500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-tertiary ml-2 text-base">check_circle</span>${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// ==========================================
// 1. Mobile Menu Drawer
// ==========================================
function initMobileMenu() {
  const menuButtons = document.querySelectorAll('[data-action="toggle-mobile-menu"]');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');
  const closeBtn = document.getElementById('close-mobile-menu');

  if (!mobileDrawer) return;

  function openMenu() {
    mobileDrawer.classList.remove('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileDrawer.classList.add('translate-x-full');
    if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuButtons.forEach(btn => btn.addEventListener('click', openMenu));
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMenu);
}

// ==========================================
// 2. Navbar Hide/Show on Scroll
// ==========================================
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 120) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });
}

// ==========================================
// 3. Interactive Booking Wizard (4 Steps)
// ==========================================
const BOOKING_STATE = {
  serviceId: "groom",
  serviceName: "پکیج داماد",
  price: 2500000,
  duration: "۱۲۰ دقیقه",
  barber: "استاد احسان شریفی (طراح ارشد)",
  date: "شنبه آینده",
  time: "۱۷:۰۰",
  customerName: "",
  customerPhone: "",
  customerNotes: "",
};

const SERVICES_DATA = {
  haircut: {
    name: "اصلاح تخصصی",
    price: 800000,
    duration: "۴۵ دقیقه",
    desc: "پیرایش دقیق مو با توجه به فرم صورت و ساختار استخوانی، همراه با شستشوی آرام‌بخش و استایل نهایی."
  },
  groom: {
    name: "پکیج داماد",
    price: 2500000,
    duration: "۱۲۰ دقیقه",
    desc: "تجربه‌ای کامل برای مهم‌ترین روز زندگی. شامل اصلاح مو، پیرایش ریش، پاکسازی عمیق پوست، ماساژ سر و صورت."
  },
  facial: {
    name: "پاکسازی پوست",
    price: 1200000,
    duration: "۶۰ دقیقه",
    desc: "لایه‌برداری ملایم، بخور سرد و گرم، تخلیه منافذ و استفاده از ماسک‌های تخصصی برای شادابی پوست صورت."
  },
  beard: {
    name: "پیرایش و طراحی ریش",
    price: 500000,
    duration: "۳۰ دقیقه",
    desc: "قرینه‌سازی خط ریش، کوتاهی با متد لیزری، حوله داغ، ماساژ با روغن معطر و اسپا."
  },
  vip: {
    name: "پکیج ویژه VIP تک",
    price: 1800000,
    duration: "۹۰ دقیقه",
    desc: "اصلاح مو ژورنالی + طراحی ریش + اسکراب طلا و ماساژ ریلکسی در سوئیت اختصاصی."
  }
};

function initBookingWizard() {
  const wizardContainer = document.getElementById('booking-wizard');
  if (!wizardContainer) return;

  let currentStep = 1;
  const totalSteps = 4;

  const stepIndicator = document.getElementById('wizard-step-indicator');
  const btnPrev = document.getElementById('wizard-prev-btn');
  const btnNext = document.getElementById('wizard-next-btn');

  function updateStepView() {
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
      const stepEl = document.getElementById(`step-${i}`);
      if (stepEl) {
        if (i === currentStep) {
          stepEl.classList.remove('hidden');
          stepEl.classList.add('block');
        } else {
          stepEl.classList.add('hidden');
          stepEl.classList.remove('block');
        }
      }
    }

    // Update indicator
    if (stepIndicator) {
      stepIndicator.textContent = `مرحله ${toPersianDigits(currentStep)} از ${toPersianDigits(totalSteps)}`;
    }

    // Toggle Prev Button
    if (btnPrev) {
      if (currentStep === 1) {
        btnPrev.classList.add('invisible');
      } else {
        btnPrev.classList.remove('invisible');
      }
    }

    // Update Next Button label
    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.classList.add('hidden');
      } else {
        btnNext.classList.remove('hidden');
        btnNext.innerHTML = `ادامه <span class="material-symbols-outlined text-sm mr-1">arrow_back</span>`;
      }
    }

    // If on Step 4, update summary
    if (currentStep === 4) {
      populateBookingSummary();
    }
  }

  // Handle service selection cards
  const serviceInputs = document.querySelectorAll('input[name="service"]');
  serviceInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const sId = e.target.value;
      if (SERVICES_DATA[sId]) {
        BOOKING_STATE.serviceId = sId;
        BOOKING_STATE.serviceName = SERVICES_DATA[sId].name;
        BOOKING_STATE.price = SERVICES_DATA[sId].price;
        BOOKING_STATE.duration = SERVICES_DATA[sId].duration;
      }
    });
  });

  // Handle Barber Selection
  const barberInputs = document.querySelectorAll('input[name="barber"]');
  barberInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      BOOKING_STATE.barber = e.target.value;
    });
  });

  // Handle Date Selection
  const dateInputs = document.querySelectorAll('input[name="booking_date"]');
  dateInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      BOOKING_STATE.date = e.target.value;
    });
  });

  // Handle Time Selection
  const timeInputs = document.querySelectorAll('input[name="booking_time"]');
  timeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      BOOKING_STATE.time = e.target.value;
    });
  });

  // Next / Prev Button events
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep === 3) {
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        const notesInput = document.getElementById('customer-notes');

        if (!nameInput || !nameInput.value.trim()) {
          showToast('لطفاً نام و نام خانوادگی خود را وارد نمایید.');
          nameInput && nameInput.focus();
          return;
        }
        if (!phoneInput || phoneInput.value.trim().length < 10) {
          showToast('لطفاً یک شماره موبایل معتبر وارد فرمایید.');
          phoneInput && phoneInput.focus();
          return;
        }

        BOOKING_STATE.customerName = nameInput.value.trim();
        BOOKING_STATE.customerPhone = phoneInput.value.trim();
        BOOKING_STATE.customerNotes = notesInput ? notesInput.value.trim() : "";
      }

      if (currentStep < totalSteps) {
        currentStep++;
        updateStepView();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  }

  // Populate Step 4 Summary
  function populateBookingSummary() {
    const summaryService = document.getElementById('summary-service');
    const summaryPrice = document.getElementById('summary-price');
    const summaryDuration = document.getElementById('summary-duration');
    const summaryBarber = document.getElementById('summary-barber');
    const summaryDateTime = document.getElementById('summary-datetime');
    const summaryCustomer = document.getElementById('summary-customer');

    if (summaryService) summaryService.textContent = BOOKING_STATE.serviceName;
    if (summaryPrice) summaryPrice.textContent = formatPrice(BOOKING_STATE.price);
    if (summaryDuration) summaryDuration.textContent = BOOKING_STATE.duration;
    if (summaryBarber) summaryBarber.textContent = BOOKING_STATE.barber;
    if (summaryDateTime) summaryDateTime.textContent = `${BOOKING_STATE.date} - ساعت ${toPersianDigits(BOOKING_STATE.time)}`;
    if (summaryCustomer) summaryCustomer.textContent = `${BOOKING_STATE.customerName} (${toPersianDigits(BOOKING_STATE.customerPhone)})`;

    // Setup Telegram Booking Dispatch
    const telegramBtn = document.getElementById('btn-telegram-book');
    if (telegramBtn) {
      telegramBtn.onclick = () => {
        const message = `💈 *درخواست رزرو نوبت آنلاین - آرایشگاه تک لوکس گرومینگ*\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `👤 *نام متقاضی:* ${BOOKING_STATE.customerName}\n` +
          `📱 *شماره تماس:* ${BOOKING_STATE.customerPhone}\n` +
          `✂️ *خدمت انتخابی:* ${BOOKING_STATE.serviceName}\n` +
          `⏱ *مدت زمان تقریبی:* ${BOOKING_STATE.duration}\n` +
          `💈 *پیرایشگر:* ${BOOKING_STATE.barber}\n` +
          `📅 *تاریخ:* ${BOOKING_STATE.date}\n` +
          `⏰ *ساعت:* ${BOOKING_STATE.time}\n` +
          `💰 *مبلغ برآوردی:* ${formatPrice(BOOKING_STATE.price)}\n` +
          (BOOKING_STATE.customerNotes ? `📝 *توضیحات متقاضی:* ${BOOKING_STATE.customerNotes}\n` : '') +
          `━━━━━━━━━━━━━━━━━━\n` +
          `لطفاً زمان نوبت را بررسی و تأیید فرمایید.`;

        const encodedMsg = encodeURIComponent(message);
        const telegramUrl = `https://t.me/${CONFIG.telegramUsername}?text=${encodedMsg}`;
        window.open(telegramUrl, '_blank');
        showToast('پیام رزرو نوبت آماده ارسال در تلگرام گردید.');
      };
    }

    // Setup WhatsApp Booking Dispatch
    const whatsappBtn = document.getElementById('btn-whatsapp-book');
    if (whatsappBtn) {
      whatsappBtn.onclick = () => {
        const message = `درخواست رزرو نوبت در آرایشگاه تک لوکس گرومینگ سمنان:\n` +
          `نام: ${BOOKING_STATE.customerName}\n` +
          `تلفن: ${BOOKING_STATE.customerPhone}\n` +
          `خدمت: ${BOOKING_STATE.serviceName}\n` +
          `تاریخ و ساعت: ${BOOKING_STATE.date} - ساعت ${BOOKING_STATE.time}\n` +
          `پیرایشگر: ${BOOKING_STATE.barber}\n` +
          `مبلغ: ${formatPrice(BOOKING_STATE.price)}`;
        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodedMsg}`;
        window.open(whatsappUrl, '_blank');
      };
    }

    // Direct Instant Receipt Modal
    const confirmSystemBtn = document.getElementById('btn-confirm-booking-system');
    if (confirmSystemBtn) {
      confirmSystemBtn.onclick = () => {
        openBookingReceiptModal();
      };
    }
  }

  // Quick preset selection from main service cards
  window.selectServiceAndScroll = function(serviceKey) {
    if (SERVICES_DATA[serviceKey]) {
      const radio = document.querySelector(`input[name="service"][value="${serviceKey}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  updateStepView();
}

function openBookingReceiptModal() {
  const modal = document.getElementById('booking-receipt-modal');
  if (!modal) return;

  const trackingCode = 'TAK-' + Math.floor(100000 + Math.random() * 900000);
  const codeEl = document.getElementById('receipt-tracking-code');
  if (codeEl) codeEl.textContent = toPersianDigits(trackingCode);

  modal.classList.add('open');
  showToast('نوبت شما با موفقیت ثبت اولیه شد.');
}

function closeBookingReceiptModal() {
  const modal = document.getElementById('booking-receipt-modal');
  if (modal) modal.classList.remove('open');
}

// ==========================================
// 4. Products Catalog & Cart Drawer
// ==========================================
const PRODUCTS_DATA = [
  {
    id: "p1",
    name: "پماد مو خاک رسی مات تک (Matte Clay)",
    category: "styling",
    price: 480000,
    rating: "۵.۰",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=700&auto=format&fit=crop&q=80",
    desc: "فرمولاسیون اختصاصی با خاک رس معدنی و روغن آرگان. نگه‌داری قوی با فینیش مات بدون ایجاد سنگینی یا سفیدک روی مو."
  },
  {
    id: "p2",
    name: "روغن ریش و سبیل پریمیوم با اسانس سدر",
    category: "beard",
    price: 390000,
    rating: "۴.۹",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=700&auto=format&fit=crop&q=80",
    desc: "تسکین‌دهنده خارش پوست، نرم‌کننده عمیق و تقویت ریشه ریش با رایحه خنک و چوبی سدر و تنباکوی کوبایی."
  },
  {
    id: "p3",
    name: "خمیر بافت‌دهنده فیبری (Fiber Paste)",
    category: "styling",
    price: 420000,
    rating: "۴.۸",
    image: "https://images.unsplash.com/photo-1597854710119-a5a8fc096336?w=700&auto=format&fit=crop&q=80",
    desc: "ایده‌آل برای استایل‌های فید مدرن و پرپشت نشان دادن موهای کم‌پشت با ماندگاری ۲۴ ساعته."
  },
  {
    id: "p4",
    name: "ماسک لایه‌بردار کربن و میکروذرات طلا",
    category: "skin",
    price: 550000,
    rating: "۵.۰",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&auto=format&fit=crop&q=80",
    desc: "پاکسازی عمقی منافذ، رفع سلول‌های مرده، جذب چربی اضافه و ایجاد لطافت و درخشندگی فوری صورت."
  },
  {
    id: "p5",
    name: "افترشیو بالم التیام‌بخش کالاندولا و آلوئه‌ورا",
    category: "skin",
    price: 340000,
    rating: "۴.۹",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=700&auto=format&fit=crop&q=80",
    desc: "فرمول بدون الکل برای رفع سوزش تیغ و قرمزی، رطوبت‌رسانی بادوام با رایحه طراوت‌بخش لیمو و نعناع."
  },
  {
    id: "p6",
    name: "ادکلن باربرشاپ نیش تک (Leather & Amber)",
    category: "perfume",
    price: 1250000,
    rating: "۵.۰",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=700&auto=format&fit=crop&q=80",
    desc: "رایحه اصیل و پرابهت چرم، عنبر و برگ بو. امضای بویایی منحصر‌به‌فرد آرایشگاه تک با پراکندگی استثنایی."
  },
  {
    id: "p7",
    name: "شانه دست‌ساز چوب صندل قرمز ضد موخوره",
    category: "accessories",
    price: 220000,
    rating: "۴.۸",
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=700&auto=format&fit=crop&q=80",
    desc: "تراش دقیق دندانه‌ها بدون ایجاد الکتریسیته ساکن، حفظ درخشش طبیعی مو و ریش."
  },
  {
    id: "p8",
    name: "شامپو تقویتی کافئین و زینک بدون سولفات",
    category: "hair",
    price: 380000,
    rating: "۴.۹",
    image: "https://images.unsplash.com/photo-1608248597359-009d13540b6e?w=700&auto=format&fit=crop&q=80",
    desc: "افزایش گردش خون پوست سر، مهار ریزش ارثی و استحکام‌بخشی به ریشه مو."
  }
];

let cart = [];

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('tak_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  try {
    localStorage.setItem('tak_cart', JSON.stringify(cart));
  } catch (e) {}
  updateCartUI();
}

function addToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }
  saveCartToStorage();
  showToast(`«${product.name}» به سبد سفارش اضافه شد.`);
  openCartDrawer();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCartToStorage();
}

function updateCartUI() {
  // Update badge
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    b.textContent = toPersianDigits(totalCount);
    if (totalCount > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });

  // Update Cart Drawer items
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const footerContainer = document.getElementById('cart-footer-container');
  const totalAmountEl = document.getElementById('cart-total-amount');

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (footerContainer) footerContainer.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (footerContainer) footerContainer.classList.remove('hidden');

  let totalSum = 0;
  itemsContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    totalSum += itemTotal;
    return `
      <div class="flex items-center gap-4 bg-surface-container-high p-3 rounded-lg border border-white/5">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md flex-shrink-0" />
        <div class="flex-grow min-w-0">
          <h4 class="text-on-surface font-semibold text-sm line-clamp-1 mb-1">${item.name}</h4>
          <span class="text-tertiary text-xs block mb-2">${formatPrice(item.price)}</span>
          <div class="flex items-center gap-2">
            <button onclick="updateCartQty('${item.id}', -1)" class="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:text-tertiary transition-colors">
              <span class="material-symbols-outlined text-sm">remove</span>
            </button>
            <span class="text-sm font-bold px-2">${toPersianDigits(item.qty)}</span>
            <button onclick="updateCartQty('${item.id}', 1)" class="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:text-tertiary transition-colors">
              <span class="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
        </div>
        <div class="text-left font-bold text-sm text-on-surface">
          ${formatPrice(itemTotal)}
        </div>
      </div>
    `;
  }).join('');

  if (totalAmountEl) {
    totalAmountEl.textContent = formatPrice(totalSum);
  }

  // Setup Telegram Cart Checkout
  const btnTgCheckout = document.getElementById('btn-cart-telegram');
  if (btnTgCheckout) {
    btnTgCheckout.onclick = () => {
      let msg = `🛍 *سفارش محصولات آرایشگاه تک لوکس گرومینگ*\n` +
        `━━━━━━━━━━━━━━━━━━\n`;
      cart.forEach((it, idx) => {
        msg += `${toPersianDigits(idx + 1)}. *${it.name}*\n   تعداد: ${toPersianDigits(it.qty)} عدد | مبلغ: ${formatPrice(it.price * it.qty)}\n`;
      });
      msg += `━━━━━━━━━━━━━━━━━━\n` +
        `💰 *جمع کل سفارش:* ${formatPrice(totalSum)}\n\n` +
        `لطفاً آدرس تحویل و شماره تماس را بفرمایید تا سفارش ثبت و ارسال گردد.`;

      const tgUrl = `https://t.me/${CONFIG.telegramUsername}?text=${encodeURIComponent(msg)}`;
      window.open(tgUrl, '_blank');
    };
  }

  // Setup WhatsApp Cart Checkout
  const btnWaCheckout = document.getElementById('btn-cart-whatsapp');
  if (btnWaCheckout) {
    btnWaCheckout.onclick = () => {
      let msg = `سلام، سفارش محصولات از تک لوکس گرومینگ دارم:\n`;
      cart.forEach((it, idx) => {
        msg += `${idx + 1}. ${it.name} (${it.qty} عدد) - ${formatPrice(it.price * it.qty)}\n`;
      });
      msg += `جمع کل: ${formatPrice(totalSum)}`;
      const waUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    };
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.add('hidden');
  document.body.style.overflow = '';
}

function singleProductTelegramOrder(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const msg = `💈 *درخواست خرید مستقیم محصول از تک لوکس گرومینگ*\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `📦 *نام کالا:* ${product.name}\n` +
    `💰 *قیمت:* ${formatPrice(product.price)}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `لطفاً نحوه پرداخت و ارسال به آدرس اینجانب را مشخص فرمایید.`;

  const url = `https://t.me/${CONFIG.telegramUsername}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function initProductsCatalog() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  let activeFilter = 'all';
  let searchTerm = '';

  function render() {
    const filtered = PRODUCTS_DATA.filter(p => {
      const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
      const matchesSearch = p.name.includes(searchTerm) || p.desc.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-5xl mb-3 text-secondary">search_off</span>
          <p class="text-lg">هیچ محصولی با مشخصات وارد شده یافت نشد.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => `
      <div class="group bg-surface-container rounded-xl overflow-hidden border border-white/5 hover:border-tertiary/40 transition-all duration-300 ambient-shadow flex flex-col justify-between">
        <div class="relative h-64 overflow-hidden bg-surface-container-high">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-hover" loading="lazy" />
          <div class="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded text-xs text-tertiary font-bold flex items-center gap-1 border border-secondary-container/30">
            <span class="material-symbols-outlined text-xs fill">star</span>
            <span>${toPersianDigits(p.rating)}</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent opacity-80"></div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-headline-md font-bold text-on-surface mb-2 text-base leading-snug group-hover:text-tertiary transition-colors">${p.name}</h3>
          <p class="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">${p.desc}</p>
          
          <div class="mt-auto pt-4 border-t border-secondary-container/20 flex flex-col gap-3">
            <div class="flex justify-between items-center">
              <span class="text-xs text-on-surface-variant">قیمت مصرف‌کننده</span>
              <span class="text-tertiary font-bold text-lg">${formatPrice(p.price)}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <button onclick="addToCart('${p.id}')" class="bg-surface-container-high hover:bg-tertiary hover:text-primary-container text-on-surface text-xs font-bold py-2.5 px-3 rounded transition-colors flex items-center justify-center gap-1.5 border border-white/10">
                <span class="material-symbols-outlined text-sm">shopping_cart</span>
                <span>افزودن به سبد</span>
              </button>
              <button onclick="singleProductTelegramOrder('${p.id}')" class="bg-tertiary text-primary-container hover:bg-tertiary-fixed text-xs font-bold py-2.5 px-3 rounded transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-sm">send</span>
                <span>سفارش تلگرام</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Filter Buttons
  const filterBtns = document.querySelectorAll('[data-product-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-tertiary', 'text-primary-container', 'font-bold');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.add('bg-tertiary', 'text-primary-container', 'font-bold');
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      activeFilter = btn.getAttribute('data-product-filter');
      render();
    });
  });

  // Search input
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      render();
    });
  }

  render();
}

// ==========================================
// 5. Gallery Lightbox Modal
// ==========================================
function initGalleryLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');

  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox-src');
      const title = item.getAttribute('data-lightbox-title') || 'نمونه کار تک لوکس گرومینگ';
      const desc = item.getAttribute('data-lightbox-desc') || '';

      if (lightboxImg) lightboxImg.src = src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

// ==========================================
// 6. Contact Form Dispatcher
// ==========================================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !phone || !message) {
      showToast('لطفاً تمامی فیلدهای الزامی را تکمیل فرمایید.');
      return;
    }

    const tgMessage = `📬 *پیام جدید از فرم تماس وبسایت Tak Luxe Grooming*\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 *فرستنده:* ${name}\n` +
      `📱 *شماره همراه:* ${phone}\n` +
      `📌 *موضوع:* ${subject || 'عمومی'}\n` +
      `💬 *متن پیام:*\n${message}\n` +
      `━━━━━━━━━━━━━━━━━━`;

    const tgUrl = `https://t.me/${CONFIG.telegramUsername}?text=${encodeURIComponent(tgMessage)}`;
    window.open(tgUrl, '_blank');
    showToast('پیام شما آماده ارسال به تلگرام واحد پشتیبانی گردید.');
    contactForm.reset();
  });
}

// ==========================================
// Global Initializer
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
  initBookingWizard();
  initProductsCatalog();
  initGalleryLightbox();
  initContactForm();
  loadCartFromStorage();

  // Setup cart triggers
  const cartOpenButtons = document.querySelectorAll('[data-action="open-cart"]');
  const cartCloseButtons = document.querySelectorAll('[data-action="close-cart"]');
  const cartBackdrop = document.getElementById('cart-backdrop');

  cartOpenButtons.forEach(b => b.addEventListener('click', openCartDrawer));
  cartCloseButtons.forEach(b => b.addEventListener('click', closeCartDrawer));
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);
});
