/**
 * Generates locale JSON files for all supported languages.
 * Run: node scripts/generate-locales.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { extensions, deepMerge } from './locale-extensions.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const localesDir = join(__dirname, '../src/locales')

const langs = ['ru', 'en', 'de', 'pt', 'ja', 'it', 'es', 'fr', 'ar', 'zh-CN']
const namespaces = ['common', 'landing', 'auth', 'trainer', 'client', 'admin']

const T = {
  common: {
    ru: {
      language: { switch: 'Выбрать язык' },
      actions: {
        save: 'Сохранить',
        cancel: 'Отмена',
        login: 'Войти',
        logout: 'Выйти',
        add: 'Добавить',
        edit: 'Редактировать',
        delete: 'Удалить',
        upload: 'Загрузить',
        search: 'Поиск…',
        loading: 'Загрузка…',
        createAccount: 'Создать аккаунт',
        startFree: 'Начать бесплатно',
        demo: 'Демо',
      },
      nav: {
        product: 'Продукт',
        features: 'Возможности',
        clientExperience: 'Кабинет клиента',
        pricing: 'Тарифы',
        account: 'Аккаунт',
        builder: 'Конструктор',
        analytics: 'Аналитика',
        closeMenu: 'Закрыть меню',
        openMenu: 'Открыть меню',
        mobileMenu: 'Мобильное меню',
      },
      footer: {
        tagline: 'CRM, календарь, программы, финансы и клиентский кабинет для фитнес-тренеров.',
        product: 'Продукт',
        forTrainers: 'Для тренеров',
        forClients: 'Для клиентов',
        company: 'Компания',
        about: 'О нас',
        contacts: 'Контакты',
        legal: 'Правовое',
        policy: 'Политика',
        terms: 'Оферта',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Навыки',
      notFound: 'Не найдено',
      deleted: 'Удалено',
      saveError: 'Ошибка сохранения',
    },
    en: {
      language: { switch: 'Select language' },
      actions: {
        save: 'Save',
        cancel: 'Cancel',
        login: 'Log in',
        logout: 'Log out',
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        upload: 'Upload',
        search: 'Search…',
        loading: 'Loading…',
        createAccount: 'Create account',
        startFree: 'Start for free',
        demo: 'Demo',
      },
      nav: {
        product: 'Product',
        features: 'Features',
        clientExperience: 'Client experience',
        pricing: 'Pricing',
        account: 'Account',
        builder: 'Builder',
        analytics: 'Analytics',
        closeMenu: 'Close menu',
        openMenu: 'Open menu',
        mobileMenu: 'Mobile menu',
      },
      footer: {
        tagline: 'CRM, calendar, programs, finances and client portal for fitness trainers.',
        product: 'Product',
        forTrainers: 'For trainers',
        forClients: 'For clients',
        company: 'Company',
        about: 'About',
        contacts: 'Contact',
        legal: 'Legal',
        policy: 'Privacy',
        terms: 'Terms',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'Not found',
      deleted: 'Deleted',
      saveError: 'Save failed',
    },
    de: {
      language: { switch: 'Sprache wählen' },
      actions: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        login: 'Anmelden',
        logout: 'Abmelden',
        add: 'Hinzufügen',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        upload: 'Hochladen',
        search: 'Suchen…',
        loading: 'Laden…',
        createAccount: 'Konto erstellen',
        startFree: 'Kostenlos starten',
        demo: 'Demo',
      },
      nav: {
        product: 'Produkt',
        features: 'Funktionen',
        clientExperience: 'Kundenerlebnis',
        pricing: 'Preise',
        account: 'Konto',
        builder: 'Builder',
        analytics: 'Analytik',
        closeMenu: 'Menü schließen',
        openMenu: 'Menü öffnen',
        mobileMenu: 'Mobiles Menü',
      },
      footer: {
        tagline: 'CRM, Kalender, Programme, Finanzen und Kundenportal für Fitnesstrainer.',
        product: 'Produkt',
        forTrainers: 'Für Trainer',
        forClients: 'Für Kunden',
        company: 'Unternehmen',
        about: 'Über uns',
        contacts: 'Kontakt',
        legal: 'Rechtliches',
        policy: 'Datenschutz',
        terms: 'AGB',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'Nicht gefunden',
      deleted: 'Gelöscht',
      saveError: 'Speichern fehlgeschlagen',
    },
    pt: {
      language: { switch: 'Selecionar idioma' },
      actions: {
        save: 'Salvar',
        cancel: 'Cancelar',
        login: 'Entrar',
        logout: 'Sair',
        add: 'Adicionar',
        edit: 'Editar',
        delete: 'Excluir',
        upload: 'Enviar',
        search: 'Pesquisar…',
        loading: 'Carregando…',
        createAccount: 'Criar conta',
        startFree: 'Começar grátis',
        demo: 'Demo',
      },
      nav: {
        product: 'Produto',
        features: 'Recursos',
        clientExperience: 'Experiência do cliente',
        pricing: 'Preços',
        account: 'Conta',
        builder: 'Construtor',
        analytics: 'Análises',
        closeMenu: 'Fechar menu',
        openMenu: 'Abrir menu',
        mobileMenu: 'Menu móvel',
      },
      footer: {
        tagline: 'CRM, calendário, programas, finanças e portal do cliente para treinadores.',
        product: 'Produto',
        forTrainers: 'Para treinadores',
        forClients: 'Para clientes',
        company: 'Empresa',
        about: 'Sobre',
        contacts: 'Contato',
        legal: 'Legal',
        policy: 'Privacidade',
        terms: 'Termos',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'Não encontrado',
      deleted: 'Excluído',
      saveError: 'Falha ao salvar',
    },
    ja: {
      language: { switch: '言語を選択' },
      actions: {
        save: '保存',
        cancel: 'キャンセル',
        login: 'ログイン',
        logout: 'ログアウト',
        add: '追加',
        edit: '編集',
        delete: '削除',
        upload: 'アップロード',
        search: '検索…',
        loading: '読み込み中…',
        createAccount: 'アカウント作成',
        startFree: '無料で始める',
        demo: 'デモ',
      },
      nav: {
        product: '製品',
        features: '機能',
        clientExperience: 'クライアント体験',
        pricing: '料金',
        account: 'アカウント',
        builder: 'ビルダー',
        analytics: '分析',
        closeMenu: 'メニューを閉じる',
        openMenu: 'メニューを開く',
        mobileMenu: 'モバイルメニュー',
      },
      footer: {
        tagline: 'フィットネストレーナー向けCRM、カレンダー、プログラム、財務、クライアントポータル。',
        product: '製品',
        forTrainers: 'トレーナー向け',
        forClients: 'クライアント向け',
        company: '会社',
        about: '概要',
        contacts: 'お問い合わせ',
        legal: '法的情報',
        policy: 'プライバシー',
        terms: '利用規約',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'スキル',
      notFound: '見つかりません',
      deleted: '削除しました',
      saveError: '保存に失敗しました',
    },
    it: {
      language: { switch: 'Seleziona lingua' },
      actions: {
        save: 'Salva',
        cancel: 'Annulla',
        login: 'Accedi',
        logout: 'Esci',
        add: 'Aggiungi',
        edit: 'Modifica',
        delete: 'Elimina',
        upload: 'Carica',
        search: 'Cerca…',
        loading: 'Caricamento…',
        createAccount: 'Crea account',
        startFree: 'Inizia gratis',
        demo: 'Demo',
      },
      nav: {
        product: 'Prodotto',
        features: 'Funzionalità',
        clientExperience: 'Esperienza cliente',
        pricing: 'Prezzi',
        account: 'Account',
        builder: 'Builder',
        analytics: 'Analisi',
        closeMenu: 'Chiudi menu',
        openMenu: 'Apri menu',
        mobileMenu: 'Menu mobile',
      },
      footer: {
        tagline: 'CRM, calendario, programmi, finanze e portale clienti per personal trainer.',
        product: 'Prodotto',
        forTrainers: 'Per trainer',
        forClients: 'Per clienti',
        company: 'Azienda',
        about: 'Chi siamo',
        contacts: 'Contatti',
        legal: 'Legale',
        policy: 'Privacy',
        terms: 'Termini',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'Non trovato',
      deleted: 'Eliminato',
      saveError: 'Salvataggio non riuscito',
    },
    es: {
      language: { switch: 'Seleccionar idioma' },
      actions: {
        save: 'Guardar',
        cancel: 'Cancelar',
        login: 'Iniciar sesión',
        logout: 'Cerrar sesión',
        add: 'Añadir',
        edit: 'Editar',
        delete: 'Eliminar',
        upload: 'Subir',
        search: 'Buscar…',
        loading: 'Cargando…',
        createAccount: 'Crear cuenta',
        startFree: 'Empezar gratis',
        demo: 'Demo',
      },
      nav: {
        product: 'Producto',
        features: 'Funciones',
        clientExperience: 'Experiencia del cliente',
        pricing: 'Precios',
        account: 'Cuenta',
        builder: 'Constructor',
        analytics: 'Analítica',
        closeMenu: 'Cerrar menú',
        openMenu: 'Abrir menú',
        mobileMenu: 'Menú móvil',
      },
      footer: {
        tagline: 'CRM, calendario, programas, finanzas y portal de clientes para entrenadores.',
        product: 'Producto',
        forTrainers: 'Para entrenadores',
        forClients: 'Para clientes',
        company: 'Empresa',
        about: 'Sobre nosotros',
        contacts: 'Contacto',
        legal: 'Legal',
        policy: 'Privacidad',
        terms: 'Términos',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'No encontrado',
      deleted: 'Eliminado',
      saveError: 'Error al guardar',
    },
    fr: {
      language: { switch: 'Choisir la langue' },
      actions: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        login: 'Connexion',
        logout: 'Déconnexion',
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        upload: 'Téléverser',
        search: 'Rechercher…',
        loading: 'Chargement…',
        createAccount: 'Créer un compte',
        startFree: 'Commencer gratuitement',
        demo: 'Démo',
      },
      nav: {
        product: 'Produit',
        features: 'Fonctionnalités',
        clientExperience: 'Expérience client',
        pricing: 'Tarifs',
        account: 'Compte',
        builder: 'Constructeur',
        analytics: 'Analytique',
        closeMenu: 'Fermer le menu',
        openMenu: 'Ouvrir le menu',
        mobileMenu: 'Menu mobile',
      },
      footer: {
        tagline: 'CRM, calendrier, programmes, finances et portail client pour coachs fitness.',
        product: 'Produit',
        forTrainers: 'Pour les coachs',
        forClients: 'Pour les clients',
        company: 'Entreprise',
        about: 'À propos',
        contacts: 'Contact',
        legal: 'Mentions légales',
        policy: 'Confidentialité',
        terms: 'Conditions',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'Skills',
      notFound: 'Introuvable',
      deleted: 'Supprimé',
      saveError: 'Échec de l’enregistrement',
    },
    ar: {
      language: { switch: 'اختر اللغة' },
      actions: {
        save: 'حفظ',
        cancel: 'إلغاء',
        login: 'تسجيل الدخول',
        logout: 'تسجيل الخروج',
        add: 'إضافة',
        edit: 'تعديل',
        delete: 'حذف',
        upload: 'رفع',
        search: 'بحث…',
        loading: 'جاري التحميل…',
        createAccount: 'إنشاء حساب',
        startFree: 'ابدأ مجاناً',
        demo: 'عرض تجريبي',
      },
      nav: {
        product: 'المنتج',
        features: 'الميزات',
        clientExperience: 'تجربة العميل',
        pricing: 'الأسعار',
        account: 'الحساب',
        builder: 'المنشئ',
        analytics: 'التحليلات',
        closeMenu: 'إغلاق القائمة',
        openMenu: 'فتح القائمة',
        mobileMenu: 'قائمة الجوال',
      },
      footer: {
        tagline: 'نظام CRM وتقويم وبرامج ومالية وبوابة عملاء لمدربي اللياقة.',
        product: 'المنتج',
        forTrainers: 'للمدربين',
        forClients: 'للعملاء',
        company: 'الشركة',
        about: 'من نحن',
        contacts: 'اتصل بنا',
        legal: 'قانوني',
        policy: 'الخصوصية',
        terms: 'الشروط',
        copyright: '© {{year}} Trenerka',
      },
      skills: 'المهارات',
      notFound: 'غير موجود',
      deleted: 'تم الحذف',
      saveError: 'فشل الحفظ',
    },
    'zh-CN': {
      language: { switch: '选择语言' },
      actions: {
        save: '保存',
        cancel: '取消',
        login: '登录',
        logout: '退出',
        add: '添加',
        edit: '编辑',
        delete: '删除',
        upload: '上传',
        search: '搜索…',
        loading: '加载中…',
        createAccount: '创建账户',
        startFree: '免费开始',
        demo: '演示',
      },
      nav: {
        product: '产品',
        features: '功能',
        clientExperience: '客户体验',
        pricing: '定价',
        account: '账户',
        builder: '构建器',
        analytics: '分析',
        closeMenu: '关闭菜单',
        openMenu: '打开菜单',
        mobileMenu: '移动菜单',
      },
      footer: {
        tagline: '面向健身教练的CRM、日历、计划、财务和客户门户。',
        product: '产品',
        forTrainers: '教练端',
        forClients: '客户端',
        company: '公司',
        about: '关于',
        contacts: '联系',
        legal: '法律',
        policy: '隐私',
        terms: '条款',
        copyright: '© {{year}} Trenerka',
      },
      skills: '技能',
      notFound: '未找到',
      deleted: '已删除',
      saveError: '保存失败',
    },
  },
  auth: {
    ru: {
      login: {
        trainer: 'Вход для тренеров',
        client: 'Вход для клиентов',
        admin: 'Вход администратора',
        demoHint: 'Демо: {{role}}@trenerka.ru / demo123',
        email: 'Email',
        password: 'Пароль',
        submitting: 'Вход…',
        welcome: 'Добро пожаловать!',
        error: 'Ошибка входа',
        forgot: 'Забыли пароль?',
        registerTrainer: 'Регистрация тренера',
      },
      register: {
        title: 'Регистрация тренера',
        subtitle: '14 дней бесплатно',
        confirmTitle: 'Подтвердите email',
        confirmText: 'Ссылка отправлена на',
        backToLogin: 'Ко входу',
        create: 'Создать аккаунт',
        hasAccount: 'Уже есть аккаунт?',
        checkEmail: 'Проверьте почту',
        error: 'Ошибка регистрации',
      },
      validation: {
        email: 'Введите корректный email',
        passwordMin6: 'Минимум 6 символов',
        passwordMin8: 'Минимум 8 символов',
      },
    },
    en: {
      login: {
        trainer: 'Trainer sign in',
        client: 'Client sign in',
        admin: 'Admin sign in',
        demoHint: 'Demo: {{role}}@trenerka.ru / demo123',
        email: 'Email',
        password: 'Password',
        submitting: 'Signing in…',
        welcome: 'Welcome!',
        error: 'Sign in failed',
        forgot: 'Forgot password?',
        registerTrainer: 'Trainer registration',
      },
      register: {
        title: 'Trainer registration',
        subtitle: '14 days free',
        confirmTitle: 'Confirm your email',
        confirmText: 'Link sent to',
        backToLogin: 'Back to sign in',
        create: 'Create account',
        hasAccount: 'Already have an account?',
        checkEmail: 'Check your email',
        error: 'Registration failed',
      },
      validation: {
        email: 'Enter a valid email',
        passwordMin6: 'At least 6 characters',
        passwordMin8: 'At least 8 characters',
      },
    },
  },
  trainer: {
    ru: {
      nav: {
        dashboard: 'Дашборд',
        clients: 'Клиенты',
        chats: 'Чаты',
        calendar: 'Календарь',
        builder: 'Конструктор',
        programs: 'Программы',
        exercises: 'Упражнения',
        finance: 'Финансы',
        analytics: 'Аналитика',
        aiCoach: 'AI-коуч',
        files: 'Файлы',
        notifications: 'Уведомления',
        settings: 'Настройки',
        more: 'Ещё',
        sections: 'Разделы',
      },
      groups: { main: 'Главное', workouts: 'Тренировки', business: 'Бизнес', other: 'Прочее' },
      role: 'Тренер · Pro',
      expandMenu: 'Развернуть меню',
      collapseMenu: 'Свернуть меню',
      exercisesPage: {
        title: 'Упражнения',
        catalog: 'Каталог из {{count}} упражнений',
        searchPlaceholder: 'Поиск упражнения…',
        notFound: 'Упражнения не найдены',
        newExercise: 'Новое упражнение',
        updated: 'Упражнение обновлено',
        added: 'Упражнение добавлено',
        name: 'Название',
        muscleGroup: 'Группа мышц',
        equipment: 'Оборудование',
        level: 'Уровень',
        difficulty: { beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' },
        filters: {
          muscle: 'Группа мышц',
          equipment: 'Оборудование',
          difficulty: 'Уровень',
          all: 'Все',
          clear: 'Сбросить',
        },
        results: 'Показано {{shown}} из {{total}}',
        pagination: { prev: 'Назад', next: 'Далее', page: 'Стр. {{current}} / {{total}}' },
      },
      exerciseDetail: {
        notFound: 'Упражнение не найдено.',
        backToCatalog: 'К каталогу',
        trainer: 'Тренер: {{name}}',
        breathing: 'Дыхание',
      },
      filesPage: {
        title: 'Файлы',
        description: 'Документы и медиа клиентов. Загрузка до 10 МБ — через API /upload (MVP: демо-список).',
        clientsCount: '{{count}} клиентов',
        filesCount: '{{count}} файлов',
        training: 'Обучение',
        trainingHint: 'Курсы и материалы Фитнес Академии',
        demo: 'Демо',
      },
      settings: { title: 'Настройки', profile: 'Профиль тренера', name: 'Имя' },
    },
    en: {
      nav: {
        dashboard: 'Dashboard',
        clients: 'Clients',
        chats: 'Chats',
        calendar: 'Calendar',
        builder: 'Builder',
        programs: 'Programs',
        exercises: 'Exercises',
        finance: 'Finance',
        analytics: 'Analytics',
        aiCoach: 'AI Coach',
        files: 'Files',
        notifications: 'Notifications',
        settings: 'Settings',
        more: 'More',
        sections: 'Sections',
      },
      groups: { main: 'Main', workouts: 'Workouts', business: 'Business', other: 'Other' },
      role: 'Trainer · Pro',
      expandMenu: 'Expand menu',
      collapseMenu: 'Collapse menu',
      exercisesPage: {
        title: 'Exercises',
        catalog: 'Catalog of {{count}} exercises',
        searchPlaceholder: 'Search exercises…',
        notFound: 'No exercises found',
        newExercise: 'New exercise',
        updated: 'Exercise updated',
        added: 'Exercise added',
        name: 'Name',
        muscleGroup: 'Muscle group',
        equipment: 'Equipment',
        level: 'Level',
        difficulty: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
        filters: {
          muscle: 'Muscle group',
          equipment: 'Equipment',
          difficulty: 'Level',
          all: 'All',
          clear: 'Clear',
        },
        results: 'Showing {{shown}} of {{total}}',
        pagination: { prev: 'Previous', next: 'Next', page: 'Page {{current}} / {{total}}' },
      },
      exerciseDetail: {
        notFound: 'Exercise not found.',
        backToCatalog: 'Back to catalog',
        trainer: 'Trainer: {{name}}',
        breathing: 'Breathing',
      },
      filesPage: {
        title: 'Files',
        description: 'Client documents and media. Upload up to 10 MB via API /upload (MVP: demo list).',
        clientsCount: '{{count}} clients',
        filesCount: '{{count}} files',
        training: 'Training',
        trainingHint: 'Fitness Academy courses and materials',
        demo: 'Demo',
      },
      settings: { title: 'Settings', profile: 'Trainer profile', name: 'Name' },
    },
  },
  client: {
    ru: {
      nav: { today: 'Сегодня', progress: 'Прогресс', workouts: 'Тренировки', chat: 'Чат', profile: 'Профиль' },
      cabinet: 'личный кабинет',
      profile: {
        title: 'Профиль',
        defaultName: 'Клиент',
        filesTitle: 'Файлы и ресурсы',
        filesHint: 'Документы тренера и обучающие материалы.',
        premium: 'Premium client',
      },
    },
    en: {
      nav: { today: 'Today', progress: 'Progress', workouts: 'Workouts', chat: 'Chat', profile: 'Profile' },
      cabinet: 'personal account',
      profile: {
        title: 'Profile',
        defaultName: 'Client',
        filesTitle: 'Files & resources',
        filesHint: 'Trainer documents and learning materials.',
        premium: 'Premium client',
      },
    },
  },
  admin: {
    ru: { dashboard: 'Панель администратора' },
    en: { dashboard: 'Admin dashboard' },
  },
}

// Fill missing langs from English for auth/trainer/client/admin
function fillFromEn(ns, lang) {
  if (T[ns][lang]) return T[ns][lang]
  return T[ns].en
}

// Extend auth/trainer/client/admin for non-en/ru langs using machine translation patterns
const authExtras = {
  de: {
    login: { trainer: 'Trainer-Anmeldung', client: 'Kunden-Anmeldung', admin: 'Admin-Anmeldung', demoHint: 'Demo: {{role}}@trenerka.ru / demo123', email: 'E-Mail', password: 'Passwort', submitting: 'Anmeldung…', welcome: 'Willkommen!', error: 'Anmeldung fehlgeschlagen', forgot: 'Passwort vergessen?', registerTrainer: 'Trainer-Registrierung' },
    register: { title: 'Trainer-Registrierung', subtitle: '14 Tage kostenlos', name: 'Name', confirmTitle: 'E-Mail bestätigen', confirmText: 'Link gesendet an', backToLogin: 'Zur Anmeldung', create: 'Konto erstellen', hasAccount: 'Bereits ein Konto?', checkEmail: 'E-Mail prüfen', error: 'Registrierung fehlgeschlagen' },
    validation: { email: 'Gültige E-Mail eingeben', passwordMin6: 'Mindestens 6 Zeichen', passwordMin8: 'Mindestens 8 Zeichen', name: 'Name eingeben' },
  },
  pt: {
    login: { trainer: 'Entrada do treinador', client: 'Entrada do cliente', admin: 'Entrada do administrador', demoHint: 'Demo: {{role}}@trenerka.ru / demo123', email: 'Email', password: 'Senha', submitting: 'Entrando…', welcome: 'Bem-vindo!', error: 'Falha no login', forgot: 'Esqueceu a senha?', registerTrainer: 'Registro de treinador' },
    register: { title: 'Registro de treinador', subtitle: '14 dias grátis', name: 'Nome', confirmTitle: 'Confirme o email', confirmText: 'Link enviado para', backToLogin: 'Voltar ao login', create: 'Criar conta', hasAccount: 'Já tem conta?', checkEmail: 'Verifique o email', error: 'Falha no registro' },
    validation: { email: 'Digite um email válido', passwordMin6: 'Mínimo 6 caracteres', passwordMin8: 'Mínimo 8 caracteres', name: 'Digite o nome' },
  },
  ja: {
    login: { trainer: 'トレーナーログイン', client: 'クライアントログイン', admin: '管理者ログイン', demoHint: 'デモ: {{role}}@trenerka.ru / demo123', email: 'メール', password: 'パスワード', submitting: 'ログイン中…', welcome: 'ようこそ！', error: 'ログイン失敗', forgot: 'パスワードをお忘れですか？', registerTrainer: 'トレーナー登録' },
    register: { title: 'トレーナー登録', subtitle: '14日間無料', name: '名前', confirmTitle: 'メールを確認', confirmText: 'リンクを送信しました', backToLogin: 'ログインへ', create: 'アカウント作成', hasAccount: 'すでにアカウントがありますか？', checkEmail: 'メールを確認してください', error: '登録に失敗しました' },
    validation: { email: '有効なメールを入力', passwordMin6: '6文字以上', passwordMin8: '8文字以上', name: '名前を入力' },
  },
  it: {
    login: { trainer: 'Accesso trainer', client: 'Accesso cliente', admin: 'Accesso admin', demoHint: 'Demo: {{role}}@trenerka.ru / demo123', email: 'Email', password: 'Password', submitting: 'Accesso…', welcome: 'Benvenuto!', error: 'Accesso non riuscito', forgot: 'Password dimenticata?', registerTrainer: 'Registrazione trainer' },
    register: { title: 'Registrazione trainer', subtitle: '14 giorni gratis', name: 'Nome', confirmTitle: 'Conferma email', confirmText: 'Link inviato a', backToLogin: 'Torna al login', create: 'Crea account', hasAccount: 'Hai già un account?', checkEmail: 'Controlla la email', error: 'Registrazione non riuscita' },
    validation: { email: 'Inserisci email valida', passwordMin6: 'Almeno 6 caratteri', passwordMin8: 'Almeno 8 caratteri', name: 'Inserisci il nome' },
  },
  es: {
    login: { trainer: 'Acceso entrenador', client: 'Acceso cliente', admin: 'Acceso administrador', demoHint: 'Demo: {{role}}@trenerka.ru / demo123', email: 'Email', password: 'Contraseña', submitting: 'Iniciando sesión…', welcome: '¡Bienvenido!', error: 'Error de acceso', forgot: '¿Olvidaste la contraseña?', registerTrainer: 'Registro de entrenador' },
    register: { title: 'Registro de entrenador', subtitle: '14 días gratis', name: 'Nombre', confirmTitle: 'Confirma el email', confirmText: 'Enlace enviado a', backToLogin: 'Volver al acceso', create: 'Crear cuenta', hasAccount: '¿Ya tienes cuenta?', checkEmail: 'Revisa tu email', error: 'Error de registro' },
    validation: { email: 'Introduce un email válido', passwordMin6: 'Mínimo 6 caracteres', passwordMin8: 'Mínimo 8 caracteres', name: 'Introduce el nombre' },
  },
  fr: {
    login: { trainer: 'Connexion coach', client: 'Connexion client', admin: 'Connexion admin', demoHint: 'Démo : {{role}}@trenerka.ru / demo123', email: 'Email', password: 'Mot de passe', submitting: 'Connexion…', welcome: 'Bienvenue !', error: 'Échec de connexion', forgot: 'Mot de passe oublié ?', registerTrainer: 'Inscription coach' },
    register: { title: 'Inscription coach', subtitle: '14 jours gratuits', name: 'Nom', confirmTitle: 'Confirmez l’email', confirmText: 'Lien envoyé à', backToLogin: 'Retour connexion', create: 'Créer un compte', hasAccount: 'Déjà un compte ?', checkEmail: 'Vérifiez votre email', error: 'Échec d’inscription' },
    validation: { email: 'Email valide requis', passwordMin6: '6 caractères minimum', passwordMin8: '8 caractères minimum', name: 'Entrez le nom' },
  },
  ar: {
    login: { trainer: 'دخول المدرب', client: 'دخول العميل', admin: 'دخول المسؤول', demoHint: 'تجريبي: {{role}}@trenerka.ru / demo123', email: 'البريد', password: 'كلمة المرور', submitting: 'جاري الدخول…', welcome: 'مرحباً!', error: 'فشل تسجيل الدخول', forgot: 'نسيت كلمة المرور؟', registerTrainer: 'تسجيل مدرب' },
    register: { title: 'تسجيل مدرب', subtitle: '14 يوماً مجاناً', name: 'الاسم', confirmTitle: 'أكد البريد', confirmText: 'تم إرسال الرابط إلى', backToLogin: 'العودة للدخول', create: 'إنشاء حساب', hasAccount: 'لديك حساب؟', checkEmail: 'تحقق من بريدك', error: 'فشل التسجيل' },
    validation: { email: 'أدخل بريداً صالحاً', passwordMin6: '6 أحرف على الأقل', passwordMin8: '8 أحرف على الأقل', name: 'أدخل الاسم' },
  },
  'zh-CN': {
    login: { trainer: '教练登录', client: '客户登录', admin: '管理员登录', demoHint: '演示：{{role}}@trenerka.ru / demo123', email: '邮箱', password: '密码', submitting: '登录中…', welcome: '欢迎！', error: '登录失败', forgot: '忘记密码？', registerTrainer: '教练注册' },
    register: { title: '教练注册', subtitle: '免费14天', name: '姓名', confirmTitle: '确认邮箱', confirmText: '链接已发送至', backToLogin: '返回登录', create: '创建账户', hasAccount: '已有账户？', checkEmail: '请查收邮件', error: '注册失败' },
    validation: { email: '请输入有效邮箱', passwordMin6: '至少6个字符', passwordMin8: '至少8个字符', name: '请输入姓名' },
  },
}

Object.assign(T.auth, authExtras)

// Trainer translations for other langs - use compact copies from patterns
const trainerNav = (l) => {
  const maps = {
    de: { dashboard: 'Dashboard', clients: 'Kunden', chats: 'Chats', calendar: 'Kalender', builder: 'Builder', programs: 'Programme', exercises: 'Übungen', finance: 'Finanzen', analytics: 'Analytik', aiCoach: 'KI-Coach', files: 'Dateien', notifications: 'Benachrichtigungen', settings: 'Einstellungen', more: 'Mehr', sections: 'Bereiche' },
    pt: { dashboard: 'Painel', clients: 'Clientes', chats: 'Chats', calendar: 'Calendário', builder: 'Construtor', programs: 'Programas', exercises: 'Exercícios', finance: 'Finanças', analytics: 'Análises', aiCoach: 'Coach IA', files: 'Arquivos', notifications: 'Notificações', settings: 'Configurações', more: 'Mais', sections: 'Seções' },
    ja: { dashboard: 'ダッシュボード', clients: 'クライアント', chats: 'チャット', calendar: 'カレンダー', builder: 'ビルダー', programs: 'プログラム', exercises: 'エクササイズ', finance: '財務', analytics: '分析', aiCoach: 'AIコーチ', files: 'ファイル', notifications: '通知', settings: '設定', more: 'その他', sections: 'セクション' },
    it: { dashboard: 'Dashboard', clients: 'Clienti', chats: 'Chat', calendar: 'Calendario', builder: 'Builder', programs: 'Programmi', exercises: 'Esercizi', finance: 'Finanze', analytics: 'Analisi', aiCoach: 'Coach IA', files: 'File', notifications: 'Notifiche', settings: 'Impostazioni', more: 'Altro', sections: 'Sezioni' },
    es: { dashboard: 'Panel', clients: 'Clientes', chats: 'Chats', calendar: 'Calendario', builder: 'Constructor', programs: 'Programas', exercises: 'Ejercicios', finance: 'Finanzas', analytics: 'Analítica', aiCoach: 'Coach IA', files: 'Archivos', notifications: 'Notificaciones', settings: 'Ajustes', more: 'Más', sections: 'Secciones' },
    fr: { dashboard: 'Tableau de bord', clients: 'Clients', chats: 'Chats', calendar: 'Calendrier', builder: 'Constructeur', programs: 'Programmes', exercises: 'Exercices', finance: 'Finances', analytics: 'Analytique', aiCoach: 'Coach IA', files: 'Fichiers', notifications: 'Notifications', settings: 'Paramètres', more: 'Plus', sections: 'Sections' },
    ar: { dashboard: 'لوحة التحكم', clients: 'العملاء', chats: 'المحادثات', calendar: 'التقويم', builder: 'المنشئ', programs: 'البرامج', exercises: 'التمارين', finance: 'المالية', analytics: 'التحليلات', aiCoach: 'مدرب الذكاء', files: 'الملفات', notifications: 'الإشعارات', settings: 'الإعدادات', more: 'المزيد', sections: 'الأقسام' },
    'zh-CN': { dashboard: '仪表板', clients: '客户', chats: '聊天', calendar: '日历', builder: '构建器', programs: '计划', exercises: '练习', finance: '财务', analytics: '分析', aiCoach: 'AI教练', files: '文件', notifications: '通知', settings: '设置', more: '更多', sections: '部分' },
  }
  return maps[l]
}

for (const lang of ['de', 'pt', 'ja', 'it', 'es', 'fr', 'ar', 'zh-CN']) {
  const base = T.trainer.en
  const nav = trainerNav(lang)
  T.trainer[lang] = {
    ...base,
    nav,
    groups: lang === 'de' ? { main: 'Haupt', workouts: 'Training', business: 'Business', other: 'Sonstiges' }
      : lang === 'pt' ? { main: 'Principal', workouts: 'Treinos', business: 'Negócios', other: 'Outros' }
      : lang === 'ja' ? { main: 'メイン', workouts: 'トレーニング', business: 'ビジネス', other: 'その他' }
      : lang === 'it' ? { main: 'Principale', workouts: 'Allenamenti', business: 'Business', other: 'Altro' }
      : lang === 'es' ? { main: 'Principal', workouts: 'Entrenos', business: 'Negocio', other: 'Otros' }
      : lang === 'fr' ? { main: 'Principal', workouts: 'Entraînements', business: 'Business', other: 'Autre' }
      : lang === 'ar' ? { main: 'رئيسي', workouts: 'التدريبات', business: 'الأعمال', other: 'أخرى' }
      : { main: '主要', workouts: '训练', business: '业务', other: '其他' },
    role: lang === 'de' ? 'Trainer · Pro' : lang === 'ar' ? 'مدرب · Pro' : lang === 'zh-CN' ? '教练 · Pro' : 'Trainer · Pro',
    expandMenu: lang === 'de' ? 'Menü erweitern' : lang === 'ar' ? 'توسيع القائمة' : lang === 'zh-CN' ? '展开菜单' : lang === 'ja' ? 'メニューを展開' : 'Expand menu',
    collapseMenu: lang === 'de' ? 'Menü einklappen' : lang === 'ar' ? 'طي القائمة' : lang === 'zh-CN' ? '收起菜单' : lang === 'ja' ? 'メニューを折りたたむ' : 'Collapse menu',
    exercisesPage: {
      ...base.exercisesPage,
      title: nav.exercises,
      catalog: lang === 'de' ? 'Katalog mit {{count}} Übungen' : lang === 'pt' ? 'Catálogo de {{count}} exercícios' : lang === 'ja' ? '{{count}}件のエクササイズ' : lang === 'ar' ? 'كتالوج {{count}} تمرين' : lang === 'zh-CN' ? '{{count}}个练习目录' : `Catalog of {{count}} exercises`,
      searchPlaceholder: lang === 'de' ? 'Übung suchen…' : lang === 'ar' ? 'بحث تمرين…' : lang === 'zh-CN' ? '搜索练习…' : 'Search exercises…',
      notFound: lang === 'de' ? 'Keine Übungen' : lang === 'ar' ? 'لا تمارين' : lang === 'zh-CN' ? '未找到练习' : 'No exercises found',
      newExercise: lang === 'de' ? 'Neue Übung' : lang === 'ar' ? 'تمرين جديد' : lang === 'zh-CN' ? '新练习' : 'New exercise',
      updated: lang === 'de' ? 'Übung aktualisiert' : lang === 'ar' ? 'تم تحديث التمرين' : lang === 'zh-CN' ? '练习已更新' : 'Exercise updated',
      added: lang === 'de' ? 'Übung hinzugefügt' : lang === 'ar' ? 'تمت إضافة التمرين' : lang === 'zh-CN' ? '练习已添加' : 'Exercise added',
      name: lang === 'de' ? 'Name' : lang === 'ar' ? 'الاسم' : lang === 'zh-CN' ? '名称' : 'Name',
      muscleGroup: lang === 'de' ? 'Muskelgruppe' : lang === 'ar' ? 'مجموعة العضلات' : lang === 'zh-CN' ? '肌群' : 'Muscle group',
      equipment: lang === 'de' ? 'Gerät' : lang === 'ar' ? 'المعدات' : lang === 'zh-CN' ? '器械' : 'Equipment',
      level: lang === 'de' ? 'Niveau' : lang === 'ar' ? 'المستوى' : lang === 'zh-CN' ? '级别' : 'Level',
      difficulty: lang === 'de' ? { beginner: 'Anfänger', intermediate: 'Mittel', advanced: 'Fortgeschritten' }
        : lang === 'ar' ? { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' }
        : lang === 'zh-CN' ? { beginner: '初级', intermediate: '中级', advanced: '高级' }
        : base.exercisesPage.difficulty,
      filters: lang === 'de'
        ? { muscle: 'Muskelgruppe', equipment: 'Gerät', difficulty: 'Niveau', all: 'Alle', clear: 'Zurücksetzen' }
        : lang === 'ar'
          ? { muscle: 'مجموعة العضلات', equipment: 'المعدات', difficulty: 'المستوى', all: 'الكل', clear: 'مسح' }
          : lang === 'zh-CN'
            ? { muscle: '肌群', equipment: '器械', difficulty: '级别', all: '全部', clear: '清除' }
            : lang === 'ja'
              ? { muscle: '筋肉', equipment: '器具', difficulty: 'レベル', all: 'すべて', clear: 'クリア' }
              : lang === 'pt'
                ? { muscle: 'Grupo muscular', equipment: 'Equipamento', difficulty: 'Nível', all: 'Todos', clear: 'Limpar' }
                : lang === 'es'
                  ? { muscle: 'Grupo muscular', equipment: 'Equipo', difficulty: 'Nivel', all: 'Todos', clear: 'Borrar' }
                  : lang === 'fr'
                    ? { muscle: 'Groupe musculaire', equipment: 'Équipement', difficulty: 'Niveau', all: 'Tous', clear: 'Effacer' }
                    : lang === 'it'
                      ? { muscle: 'Gruppo muscolare', equipment: 'Attrezzo', difficulty: 'Livello', all: 'Tutti', clear: 'Cancella' }
                      : base.exercisesPage.filters,
      results: lang === 'de' ? '{{shown}} von {{total}}' : lang === 'ar' ? '{{shown}} من {{total}}' : lang === 'zh-CN' ? '显示 {{shown}} / {{total}}' : lang === 'ja' ? '{{shown}} / {{total}} 件' : 'Showing {{shown}} of {{total}}',
      pagination: lang === 'de'
        ? { prev: 'Zurück', next: 'Weiter', page: 'S. {{current}} / {{total}}' }
        : lang === 'ar'
          ? { prev: 'السابق', next: 'التالي', page: '{{current}} / {{total}}' }
          : lang === 'zh-CN'
            ? { prev: '上一页', next: '下一页', page: '第 {{current}} / {{total}} 页' }
            : lang === 'ja'
              ? { prev: '前へ', next: '次へ', page: '{{current}} / {{total}}' }
              : base.exercisesPage.pagination,
    },
    exerciseDetail: {
      notFound: lang === 'de' ? 'Übung nicht gefunden.' : lang === 'ar' ? 'التمرين غير موجود.' : lang === 'zh-CN' ? '未找到练习。' : 'Exercise not found.',
      backToCatalog: lang === 'de' ? 'Zum Katalog' : lang === 'ar' ? 'إلى الكتالوج' : lang === 'zh-CN' ? '返回目录' : 'Back to catalog',
      trainer: lang === 'de' ? 'Trainer: {{name}}' : lang === 'ar' ? 'المدرب: {{name}}' : lang === 'zh-CN' ? '教练：{{name}}' : 'Trainer: {{name}}',
      breathing: lang === 'de' ? 'Atmung' : lang === 'ar' ? 'التنفس' : lang === 'zh-CN' ? '呼吸' : 'Breathing',
    },
    filesPage: {
      title: nav.files,
      description: lang === 'de' ? 'Kundendokumente und Medien. Upload bis 10 MB (MVP: Demo).' : lang === 'ar' ? 'مستندات ووسائط العملاء. رفع حتى 10 ميجا (عرض تجريبي).' : 'Client documents and media (MVP: demo).',
      clientsCount: lang === 'de' ? '{{count}} Kunden' : lang === 'ar' ? '{{count}} عملاء' : '{{count}} clients',
      filesCount: lang === 'de' ? '{{count}} Dateien' : lang === 'ar' ? '{{count}} ملفات' : '{{count}} files',
      training: lang === 'de' ? 'Schulung' : lang === 'ar' ? 'تدريب' : lang === 'zh-CN' ? '培训' : 'Training',
      trainingHint: lang === 'de' ? 'Fitness Academy Kurse' : lang === 'ar' ? 'دورات أكاديمية اللياقة' : 'Fitness Academy courses',
      demo: lang === 'de' ? 'Demo' : lang === 'ar' ? 'تجريبي' : 'Demo',
    },
    settings: {
      title: nav.settings,
      profile: lang === 'de' ? 'Trainerprofil' : lang === 'ar' ? 'ملف المدرب' : lang === 'zh-CN' ? '教练资料' : 'Trainer profile',
      name: lang === 'de' ? 'Name' : lang === 'ar' ? 'الاسم' : lang === 'zh-CN' ? '姓名' : 'Name',
    },
  }
}

// Client for other langs
const clientExtras = {
  de: { nav: { today: 'Heute', progress: 'Fortschritt', workouts: 'Training', chat: 'Chat', profile: 'Profil' }, cabinet: 'persönlicher Bereich', profile: { title: 'Profil', defaultName: 'Kunde', filesTitle: 'Dateien & Ressourcen', filesHint: 'Trainerdokumente und Lernmaterialien.', premium: 'Premium-Kunde' } },
  pt: { nav: { today: 'Hoje', progress: 'Progresso', workouts: 'Treinos', chat: 'Chat', profile: 'Perfil' }, cabinet: 'área pessoal', profile: { title: 'Perfil', defaultName: 'Cliente', filesTitle: 'Arquivos e recursos', filesHint: 'Documentos e materiais do treinador.', premium: 'Cliente premium' } },
  ja: { nav: { today: '今日', progress: '進捗', workouts: 'トレーニング', chat: 'チャット', profile: 'プロフィール' }, cabinet: '個人エリア', profile: { title: 'プロフィール', defaultName: 'クライアント', filesTitle: 'ファイルとリソース', filesHint: 'トレーナーの資料と学習教材。', premium: 'プレミアムクライアント' } },
  it: { nav: { today: 'Oggi', progress: 'Progressi', workouts: 'Allenamenti', chat: 'Chat', profile: 'Profilo' }, cabinet: 'area personale', profile: { title: 'Profilo', defaultName: 'Cliente', filesTitle: 'File e risorse', filesHint: 'Documenti e materiali del trainer.', premium: 'Cliente premium' } },
  es: { nav: { today: 'Hoy', progress: 'Progreso', workouts: 'Entrenos', chat: 'Chat', profile: 'Perfil' }, cabinet: 'área personal', profile: { title: 'Perfil', defaultName: 'Cliente', filesTitle: 'Archivos y recursos', filesHint: 'Documentos y materiales del entrenador.', premium: 'Cliente premium' } },
  fr: { nav: { today: "Aujourd'hui", progress: 'Progrès', workouts: 'Séances', chat: 'Chat', profile: 'Profil' }, cabinet: 'espace personnel', profile: { title: 'Profil', defaultName: 'Client', filesTitle: 'Fichiers et ressources', filesHint: 'Documents et supports du coach.', premium: 'Client premium' } },
  ar: { nav: { today: 'اليوم', progress: 'التقدم', workouts: 'التدريبات', chat: 'الدردشة', profile: 'الملف' }, cabinet: 'الحساب الشخصي', profile: { title: 'الملف', defaultName: 'عميل', filesTitle: 'الملفات والموارد', filesHint: 'مستندات ومواد المدرب.', premium: 'عميل مميز' } },
  'zh-CN': { nav: { today: '今天', progress: '进度', workouts: '训练', chat: '聊天', profile: '资料' }, cabinet: '个人中心', profile: { title: '资料', defaultName: '客户', filesTitle: '文件与资源', filesHint: '教练文档和学习资料。', premium: '高级客户' } },
}
Object.assign(T.client, clientExtras)

const adminExtras = {
  de: { dashboard: 'Admin-Dashboard' },
  pt: { dashboard: 'Painel admin' },
  ja: { dashboard: '管理ダッシュボード' },
  it: { dashboard: 'Dashboard admin' },
  es: { dashboard: 'Panel de admin' },
  fr: { dashboard: 'Tableau de bord admin' },
  ar: { dashboard: 'لوحة المسؤول' },
  'zh-CN': { dashboard: '管理仪表板' },
}
Object.assign(T.admin, adminExtras)

// Landing — source of truth: committed ru/en JSON (keeps trainerPreview, benefits, pricing in sync)
const landingRu = JSON.parse(readFileSync(join(localesDir, 'ru/landing.json'), 'utf8'))
const landingEn = JSON.parse(readFileSync(join(localesDir, 'en/landing.json'), 'utf8'))

const _legacyLandingRu = {
  hero: {
    badge: 'Платформа для тренеров',
    title1: 'Управляй тренировками',
    title2: 'и клиентами',
    titleAccent: 'в одном месте',
    subtitle: 'CRM, конструктор тренировок, календарь и аналитика — без таблиц и потерянных чатов.',
    ctaPrimary: 'Начать бесплатно →',
    ctaSecondary: 'Смотреть демо',
    note: 'Бесплатно до 10 клиентов · Без карты',
  },
  preview: {
    windowTitle: 'Тренерка · Дашборд',
    greeting: 'Доброе утро, Мария 👋',
    dateLine: '{{date}} · 9 тренировок сегодня',
    sidebar: ['Дашборд', 'Клиенты', 'Тренировки', 'Календарь', 'Финансы', 'Чаты', 'Аналитика'],
    stats: {
      activeClients: ['Активных клиентов', '32', '+3 на неделе'],
      monthlyIncome: ['Доход за месяц', '₽127 400', '+18% vs прошлый'],
      sessions: ['Сессии', '52', 'на этой неделе'],
      retention: ['Удержание', '94%', '+2 п.п.'],
    },
    activeClientsTitle: 'Активные клиенты',
    scheduleTitle: 'Расписание на сегодня',
  },
  workflow: {
    eyebrow: 'Workflow',
    title: 'От клиента к отчёту — один поток',
    text: 'Четыре связанных модуля в одном интерфейсе.',
    steps: [
      { title: 'CRM', text: 'Карточка клиента, статус, оплаты и заметки' },
      { title: 'Конструктор', text: 'Программы, упражнения, подходы и назначение' },
      { title: 'Календарь', text: 'Расписание сессий и напоминания' },
      { title: 'Аналитика', text: 'Доход, удержание и посещаемость' },
    ],
  },
  showcase: {
    eyebrow: 'Дашборд',
    title: 'Рабочий стол тренера',
    text: 'Активные клиенты, расписание и метрики без лишних экранов.',
  },
  ecosystem: {
    eyebrow: 'Экосистема',
    title: 'Тренер и клиент в связке',
    text: 'Тренер ведёт практику, клиент видит программу и прогресс в кабинете.',
    trainerTab: 'Кабинет тренера',
    clientTab: 'Кабинет клиента',
    trainerGreeting: 'Доброе утро, Мария',
    clientGreeting: 'Привет, Анна',
  },
  mobile: {
    eyebrow: 'Мобильный кабинет',
    title: 'Клиент открывает тренировку с телефона',
    text: 'Сегодняшняя сессия, неделя и чат с тренером — без лишних вкладок.',
    today: 'Сегодня',
    workoutTitle: 'Силовая A',
    workoutMeta: '4 упражнения · 56 мин',
    exercises: ['Жим лёжа', 'Присед', 'Тяга', 'Планка'],
  },
  cta: {
    eyebrow: 'Старт',
    title: 'Начните вести клиентов в Trenerka',
    text: '14 дней бесплатно. Демо-аккаунт уже настроен.',
    create: 'Создать аккаунт',
    demo: 'Посмотреть демо',
  },
}

const _legacyLandingEn = {
  hero: {
    badge: 'Platform for trainers',
    title1: 'Manage workouts',
    title2: 'and clients',
    titleAccent: 'in one place',
    subtitle: 'CRM, workout builder, calendar and analytics — no spreadsheets or lost chats.',
    ctaPrimary: 'Start for free →',
    ctaSecondary: 'Watch demo',
    note: 'Free up to 10 clients · No card',
  },
  preview: {
    windowTitle: 'Trenerka · Dashboard',
    greeting: 'Good morning, Maria 👋',
    dateLine: '{{date}} · 9 workouts today',
    sidebar: ['Dashboard', 'Clients', 'Workouts', 'Calendar', 'Finance', 'Chats', 'Analytics'],
    stats: {
      activeClients: ['Active clients', '32', '+3 this week'],
      monthlyIncome: ['Monthly income', '₽127,400', '+18% vs last'],
      sessions: ['Sessions', '52', 'this week'],
      retention: ['Retention', '94%', '+2 pp'],
    },
    activeClientsTitle: 'Active clients',
    scheduleTitle: "Today's schedule",
  },
  workflow: {
    eyebrow: 'Workflow',
    title: 'From client to report — one flow',
    text: 'Four connected modules in one interface.',
    steps: [
      { title: 'CRM', text: 'Client card, status, payments and notes' },
      { title: 'Builder', text: 'Programs, exercises, sets and assignment' },
      { title: 'Calendar', text: 'Session schedule and reminders' },
      { title: 'Analytics', text: 'Revenue, retention and attendance' },
    ],
  },
  showcase: {
    eyebrow: 'Dashboard',
    title: 'Trainer workspace',
    text: 'Active clients, schedule and metrics without extra screens.',
  },
  ecosystem: {
    eyebrow: 'Ecosystem',
    title: 'Trainer and client connected',
    text: 'Trainer runs the practice; client sees program and progress in the app.',
    trainerTab: 'Trainer app',
    clientTab: 'Client app',
    trainerGreeting: 'Good morning, Maria',
    clientGreeting: 'Hi, Anna',
  },
  mobile: {
    eyebrow: 'Mobile app',
    title: 'Client opens the workout on their phone',
    text: "Today's session, week view and trainer chat — no clutter.",
    today: 'Today',
    workoutTitle: 'Strength A',
    workoutMeta: '4 exercises · 56 min',
    exercises: ['Bench press', 'Squat', 'Row', 'Plank'],
  },
  cta: {
    eyebrow: 'Get started',
    title: 'Start coaching clients in Trenerka',
    text: '14 days free. Demo account is ready.',
    create: 'Create account',
    demo: 'View demo',
  },
}

T.landing = { ru: landingRu, en: landingEn }

// For other langs use English landing (acceptable for MVP; patch hero per locale below)
for (const lang of ['de', 'pt', 'ja', 'it', 'es', 'fr', 'ar', 'zh-CN']) {
  T.landing[lang] = structuredClone(landingEn)
  // Patch hero for native feel
  if (lang === 'de') {
    Object.assign(T.landing[lang].hero, { title1: 'Trainings', title2: 'und Kunden', titleAccent: 'an einem Ort', subtitle: 'Plattform der nächsten Generation für Personal Trainer.', ctaPrimary: 'Kostenlos starten →', ctaSecondary: 'Demo ansehen', note: 'Kostenlos bis 10 Kunden · Keine Kreditkarte' })
  }
  if (lang === 'es') {
    Object.assign(T.landing[lang].hero, { title1: 'Gestiona entrenos', title2: 'y clientes', titleAccent: 'en un solo lugar', ctaPrimary: 'Empezar gratis →', ctaSecondary: 'Ver demo' })
  }
  if (lang === 'fr') {
    Object.assign(T.landing[lang].hero, { title1: 'Gérez entraînements', title2: 'et clients', titleAccent: 'au même endroit', ctaPrimary: 'Commencer gratuitement →' })
  }
  if (lang === 'ar') {
    Object.assign(T.landing[lang].hero, { title1: 'إدارة التدريبات', title2: 'والعملاء', titleAccent: 'في مكان واحد', ctaPrimary: 'ابدأ مجاناً ←', ctaSecondary: 'عرض تجريبي', note: 'مجاني حتى 10 عملاء' })
  }
  if (lang === 'zh-CN') {
    Object.assign(T.landing[lang].hero, { title1: '管理训练', title2: '与客户', titleAccent: '一站式', ctaPrimary: '免费开始 →', ctaSecondary: '观看演示' })
  }
  if (lang === 'ja') {
    Object.assign(T.landing[lang].hero, { title1: 'トレーニング', title2: 'とクライアントを', titleAccent: '一元管理', ctaPrimary: '無料で始める →' })
  }
  if (lang === 'pt') {
    Object.assign(T.landing[lang].hero, { title1: 'Gerencie treinos', title2: 'e clientes', titleAccent: 'em um só lugar', ctaPrimary: 'Começar grátis →' })
  }
  if (lang === 'it') {
    Object.assign(T.landing[lang].hero, { title1: 'Gestisci allenamenti', title2: 'e clienti', titleAccent: 'in un unico posto', ctaPrimary: 'Inizia gratis →' })
  }
}

// Merge extended keys into ru/en
for (const ns of namespaces) {
  for (const lang of ['ru', 'en']) {
    if (extensions[ns]?.[lang]) {
      T[ns][lang] = deepMerge(T[ns][lang] ?? {}, extensions[ns][lang])
    }
  }
  const enExt = extensions[ns]?.en
  if (enExt) {
    for (const lang of langs) {
      if (lang === 'ru' || lang === 'en') continue
      T[ns][lang] = deepMerge(T[ns][lang] ?? fillFromEn(ns, lang) ?? {}, enExt)
    }
  }
}

for (const lang of langs) {
  const dir = join(localesDir, lang)
  mkdirSync(dir, { recursive: true })
  for (const ns of namespaces) {
    const data = fillFromEn(ns, lang)
    if (!data) {
      console.error(`Missing ${ns}/${lang}`)
      process.exit(1)
    }
    writeFileSync(join(dir, `${ns}.json`), JSON.stringify(data, null, 2) + '\n')
  }
}

console.log('Generated locale files for:', langs.join(', '))
