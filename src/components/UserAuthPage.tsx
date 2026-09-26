import React, { useState, useEffect } from 'react';
import { ArrowLeft, Globe, UserCheck, User, LogOut, Shield, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { getCurrentUser, loginUser, registerUser, logoutUser, requestPasswordReset, resetPassword } from '../services/authService';
import { User as UserType } from '../types/auth';
import { useLanguage } from '../context/LanguageContext';
import './NeumorphicLoginForm.css';
import { LanguageModal } from './LanguageModal';

interface UserAuthPageProps {
  onBackToHome: () => void;
  onAuthSuccess?: (user: UserType) => void;
  onNavigateToAdmin?: () => void;
  onNavigateToShop?: () => void;
}

type AuthCopy = Record<'back' | 'login' | 'signup' | 'emailPhone' | 'email' | 'password' | 'fullName' | 'phone' | 'forgot' | 'signingIn' | 'creating' | 'signIn' | 'noMember' | 'signupNow' | 'alreadyMember' | 'signinNow' | 'invalidCredentials' | 'createFailed' | 'welcome' | 'accountCreated', string>;

const AUTH_COPY_BY_LANG: Record<string, AuthCopy> = {
  "en": {
    "back": "Back to Home",
    "login": "Login",
    "signup": "Sign Up",
    "emailPhone": "Email or admin username",
    "email": "Email Address",
    "password": "Password",
    "fullName": "Full Name",
    "phone": "Phone / WhatsApp",
    "forgot": "Forgot Password?",
    "signingIn": "Signing in...",
    "creating": "Creating...",
    "signIn": "Sign in",
    "noMember": "Not a member?",
    "signupNow": "sign up now",
    "alreadyMember": "Already a member?",
    "signinNow": "sign in now",
    "invalidCredentials": "Invalid email or password.",
    "createFailed": "Failed to create account.",
    "welcome": "Welcome",
    "accountCreated": "Account created! Welcome"
  },
  "en-GB": {
    "back": "Back to Home",
    "login": "Login",
    "signup": "Sign Up",
    "emailPhone": "Email or admin username",
    "email": "Email Address",
    "password": "Password",
    "fullName": "Full Name",
    "phone": "Phone / WhatsApp",
    "forgot": "Forgot Password?",
    "signingIn": "Signing in...",
    "creating": "Creating...",
    "signIn": "Sign in",
    "noMember": "Not a member?",
    "signupNow": "sign up now",
    "alreadyMember": "Already a member?",
    "signinNow": "sign in now",
    "invalidCredentials": "Invalid email or password.",
    "createFailed": "Failed to create account.",
    "welcome": "Welcome",
    "accountCreated": "Account created! Welcome"
  },
  "en-US": {
    "back": "Back to Home",
    "login": "Login",
    "signup": "Sign Up",
    "emailPhone": "Email or admin username",
    "email": "Email Address",
    "password": "Password",
    "fullName": "Full Name",
    "phone": "Phone / WhatsApp",
    "forgot": "Forgot Password?",
    "signingIn": "Signing in...",
    "creating": "Creating...",
    "signIn": "Sign in",
    "noMember": "Not a member?",
    "signupNow": "sign up now",
    "alreadyMember": "Already a member?",
    "signinNow": "sign in now",
    "invalidCredentials": "Invalid email or password.",
    "createFailed": "Failed to create account.",
    "welcome": "Welcome",
    "accountCreated": "Account created! Welcome"
  },
  "ar": {
    "back": "العودة للرئيسية",
    "login": "تسجيل الدخول",
    "signup": "إنشاء حساب",
    "emailPhone": "البريد الإلكتروني أو الهاتف",
    "email": "البريد الإلكتروني",
    "password": "كلمة المرور",
    "fullName": "الاسم الكامل",
    "phone": "الهاتف / واتساب",
    "forgot": "هل نسيت كلمة المرور؟",
    "signingIn": "جارٍ تسجيل الدخول...",
    "creating": "جارٍ إنشاء الحساب...",
    "signIn": "تسجيل الدخول",
    "noMember": "لست عضواً؟",
    "signupNow": "سجل الآن",
    "alreadyMember": "لديك حساب بالفعل؟",
    "signinNow": "سجل الدخول الآن",
    "invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "createFailed": "تعذر إنشاء الحساب.",
    "welcome": "مرحباً",
    "accountCreated": "تم إنشاء الحساب! مرحباً"
  },
  "ckb": {
    "back": "گەڕانەوە بۆ سەرەتا",
    "login": "چوونەژوورەوە",
    "signup": "دروستکردنی هەژمار",
    "emailPhone": "ئیمەیڵ یان ژمارەی مۆبایل",
    "email": "ناونیشانی ئیمەیڵ",
    "password": "وشەی نهێنی",
    "fullName": "ناوی تەواو",
    "phone": "مۆبایل / واتساپ",
    "forgot": "وشەی نهێنیت لەبیرچووە؟",
    "signingIn": "چوونەژوورەوە...",
    "creating": "دروستدەکرێت...",
    "signIn": "چوونەژوورەوە",
    "noMember": "هەژمارت نییە؟",
    "signupNow": "ئێستا خۆت تۆمار بکە",
    "alreadyMember": "پێشتر هەژمارت هەیە؟",
    "signinNow": "ئێستا بچۆ ژوورەوە",
    "invalidCredentials": "ئیمەیڵ یان وشەی نهێنی هەڵەیە.",
    "createFailed": "دروستکردنی هەژمار سەرکەوتوو نەبوو.",
    "welcome": "بەخێربێیت",
    "accountCreated": "هەژمار دروستکرا! بەخێربێیت"
  },
  "kmr": {
    "back": "Vegere Serê",
    "login": "Têketin",
    "signup": "Hesab Çêke",
    "emailPhone": "E-name an Telefon",
    "email": "Navnîşana E-nameyê",
    "password": "Şîfre",
    "fullName": "Navê Tevahiya",
    "phone": "Telefon / WhatsApp",
    "forgot": "Şîfre ji bîr kir?",
    "signingIn": "Têketin...",
    "creating": "Tê afirandin...",
    "signIn": "Têkeve",
    "noMember": "Endam nîn e?",
    "signupNow": "niha tomar be",
    "alreadyMember": "Berê endam î?",
    "signinNow": "niha têkeve",
    "invalidCredentials": "E-name an şîfre ne rast e.",
    "createFailed": "Hesab nehat afirandin.",
    "welcome": "Bi xêr hatî",
    "accountCreated": "Hesab hat afirandin! Bi xêr hatî"
  },
  "tr": {
    "back": "Ana Sayfaya Dön",
    "login": "Giriş Yap",
    "signup": "Hesap Oluştur",
    "emailPhone": "E-posta veya Telefon",
    "email": "E-posta Adresi",
    "password": "Şifre",
    "fullName": "Ad Soyad",
    "phone": "Telefon / WhatsApp",
    "forgot": "Şifrenizi mi unuttunuz?",
    "signingIn": "Giriş yapılıyor...",
    "creating": "Oluşturuluyor...",
    "signIn": "Giriş Yap",
    "noMember": "Üye değil misiniz?",
    "signupNow": "hemen kayıt olun",
    "alreadyMember": "Zaten üye misiniz?",
    "signinNow": "hemen giriş yapın",
    "invalidCredentials": "E-posta veya şifre hatalı.",
    "createFailed": "Hesap oluşturulamadı.",
    "welcome": "Hoş geldiniz",
    "accountCreated": "Hesap oluşturuldu! Hoş geldiniz"
  },
  "de": {
    "back": "Zurück zur Startseite",
    "login": "Anmelden",
    "signup": "Konto erstellen",
    "emailPhone": "E-Mail oder Telefon",
    "email": "E-Mail-Adresse",
    "password": "Passwort",
    "fullName": "Vollständiger Name",
    "phone": "Telefon / WhatsApp",
    "forgot": "Passwort vergessen?",
    "signingIn": "Anmeldung läuft...",
    "creating": "Konto wird erstellt...",
    "signIn": "Anmelden",
    "noMember": "Noch kein Mitglied?",
    "signupNow": "jetzt registrieren",
    "alreadyMember": "Bereits Mitglied?",
    "signinNow": "jetzt anmelden",
    "invalidCredentials": "E-Mail oder Passwort ist ungültig.",
    "createFailed": "Konto konnte nicht erstellt werden.",
    "welcome": "Willkommen",
    "accountCreated": "Konto erstellt! Willkommen"
  },
  "fr": {
    "back": "Retour à l'accueil",
    "login": "Connexion",
    "signup": "S'inscrire",
    "emailPhone": "E-mail ou nom d'utilisateur",
    "email": "Adresse E-mail",
    "password": "Mot de passe",
    "fullName": "Nom Complet",
    "phone": "Téléphone / WhatsApp",
    "forgot": "Mot de passe oublié ?",
    "signingIn": "Connexion en cours...",
    "creating": "Création en cours...",
    "signIn": "Se connecter",
    "noMember": "Pas encore membre ?",
    "signupNow": "créer un compte",
    "alreadyMember": "Déjà un compte ?",
    "signinNow": "connectez-vous",
    "invalidCredentials": "E-mail ou mot de passe invalide.",
    "createFailed": "Échec de la création du compte.",
    "welcome": "Bienvenue",
    "accountCreated": "Compte créé avec succès ! Bienvenue"
  },
  "it": {
    "back": "Torna alla Home",
    "login": "Accedi",
    "signup": "Registrati",
    "emailPhone": "Email o nome utente admin",
    "email": "Indirizzo Email",
    "password": "Password",
    "fullName": "Nome e Cognome",
    "phone": "Telefono / WhatsApp",
    "forgot": "Password dimenticata?",
    "signingIn": "Accesso in corso...",
    "creating": "Creazione account...",
    "signIn": "Accedi",
    "noMember": "Non hai un account?",
    "signupNow": "registrati ora",
    "alreadyMember": "Hai già un account?",
    "signinNow": "accedi ora",
    "invalidCredentials": "Email o password non valida.",
    "createFailed": "Impossibile creare l'account.",
    "welcome": "Benvenuto",
    "accountCreated": "Account creato! Benvenuto"
  },
  "es": {
    "back": "Volver al Inicio",
    "login": "Iniciar Sesión",
    "signup": "Registrarse",
    "emailPhone": "Correo electrónico o teléfono",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "fullName": "Nombre Completo",
    "phone": "Teléfono / WhatsApp",
    "forgot": "¿Olvidó su contraseña?",
    "signingIn": "Iniciando sesión...",
    "creating": "Creando cuenta...",
    "signIn": "Iniciar Sesión",
    "noMember": "¿No es miembro?",
    "signupNow": "regístrese ahora",
    "alreadyMember": "¿Ya tiene cuenta?",
    "signinNow": "inicie sesión",
    "invalidCredentials": "Correo o contraseña no válidos.",
    "createFailed": "Error al crear la cuenta.",
    "welcome": "Bienvenido",
    "accountCreated": "¡Cuenta creada! Bienvenido"
  },
  "es-MX": {
    "back": "Volver al Inicio",
    "login": "Iniciar Sesión",
    "signup": "Registrarse",
    "emailPhone": "Correo electrónico o teléfono",
    "email": "Correo Electrónico",
    "password": "Contraseña",
    "fullName": "Nombre Completo",
    "phone": "Teléfono / WhatsApp",
    "forgot": "¿Olvidó su contraseña?",
    "signingIn": "Iniciando sesión...",
    "creating": "Creando cuenta...",
    "signIn": "Iniciar Sesión",
    "noMember": "¿No es miembro?",
    "signupNow": "regístrese ahora",
    "alreadyMember": "¿Ya tiene cuenta?",
    "signinNow": "inicie sesión",
    "invalidCredentials": "Correo o contraseña no válidos.",
    "createFailed": "Error al crear la cuenta.",
    "welcome": "Bienvenido",
    "accountCreated": "¡Cuenta creada! Bienvenido"
  },
  "pt": {
    "back": "Voltar ao Início",
    "login": "Iniciar Sessão",
    "signup": "Registar",
    "emailPhone": "E-mail ou telefone",
    "email": "Endereço de E-mail",
    "password": "Palavra-passe",
    "fullName": "Nome Completo",
    "phone": "Telefone / WhatsApp",
    "forgot": "Esqueceu a palavra-passe?",
    "signingIn": "A iniciar sessão...",
    "creating": "A criar conta...",
    "signIn": "Entrar",
    "noMember": "Não é membro?",
    "signupNow": "registe-se agora",
    "alreadyMember": "Já tem conta?",
    "signinNow": "inicie sessão",
    "invalidCredentials": "E-mail ou palavra-passe inválidos.",
    "createFailed": "Falha ao criar conta.",
    "welcome": "Bem-vindo",
    "accountCreated": "Conta criada! Bem-vindo"
  },
  "pt-BR": {
    "back": "Voltar ao Início",
    "login": "Entrar",
    "signup": "Cadastrar",
    "emailPhone": "E-mail ou telefone",
    "email": "Endereço de E-mail",
    "password": "Senha",
    "fullName": "Nome Completo",
    "phone": "Telefone / WhatsApp",
    "forgot": "Esqueceu a senha?",
    "signingIn": "Entrando...",
    "creating": "Criando conta...",
    "signIn": "Entrar",
    "noMember": "Não tem conta?",
    "signupNow": "cadastre-se agora",
    "alreadyMember": "Já tem uma conta?",
    "signinNow": "entre agora",
    "invalidCredentials": "E-mail ou senha inválidos.",
    "createFailed": "Erro ao criar conta.",
    "welcome": "Bem-vindo",
    "accountCreated": "Conta criada! Bem-vindo"
  },
  "fa": {
    "back": "بازگشت به صفحه اصلی",
    "login": "ورود به حساب",
    "signup": "ثبت نام",
    "emailPhone": "ایمیل یا شماره تلفن",
    "email": "آدرس ایمیل",
    "password": "رمز عبور",
    "fullName": "نام و نام خانوادگی",
    "phone": "شماره تماس / واتساپ",
    "forgot": "رمز عبور را فراموش کرده‌اید؟",
    "signingIn": "در حال ورود...",
    "creating": "در حال ایجاد حساب...",
    "signIn": "ورود",
    "noMember": "عضو نیستید؟",
    "signupNow": "همین حالا ثبت نام کنید",
    "alreadyMember": "قبلاً ثبت نام کرده‌اید؟",
    "signinNow": "وارد شوید",
    "invalidCredentials": "ایمیل یا رمز عبور نامعتبر است.",
    "createFailed": "خطا در ایجاد حساب کاربری.",
    "welcome": "خوش آمدید",
    "accountCreated": "حساب با موفقیت ساخته شد! خوش آمدید"
  },
  "ru": {
    "back": "На главную",
    "login": "Вход",
    "signup": "Регистрация",
    "emailPhone": "Email или телефон",
    "email": "Адрес электронной почты",
    "password": "Пароль",
    "fullName": "Полное имя",
    "phone": "Телефон / WhatsApp",
    "forgot": "Забыли пароль?",
    "signingIn": "Вход в систему...",
    "creating": "Создание аккаунта...",
    "signIn": "Войти",
    "noMember": "Еще нет аккаунта?",
    "signupNow": "зарегистрироваться",
    "alreadyMember": "Уже зарегистрированы?",
    "signinNow": "войти",
    "invalidCredentials": "Неверный email или пароль.",
    "createFailed": "Не удалось создать аккаунт.",
    "welcome": "Добро пожаловать",
    "accountCreated": "Аккаунт создан! Добро пожаловать"
  },
  "zh-CN": {
    "back": "返回首页",
    "login": "登录",
    "signup": "注册新账号",
    "emailPhone": "电子邮箱或手机号",
    "email": "电子邮箱",
    "password": "密码",
    "fullName": "姓名",
    "phone": "手机 / WhatsApp",
    "forgot": "忘记密码？",
    "signingIn": "正在登录...",
    "creating": "正在创建账号...",
    "signIn": "登录",
    "noMember": "还没有账号？",
    "signupNow": "立即注册",
    "alreadyMember": "已有账号？",
    "signinNow": "立即登录",
    "invalidCredentials": "邮箱或密码不正确。",
    "createFailed": "创建账号失败。",
    "welcome": "欢迎光临",
    "accountCreated": "账号创建成功！欢迎加入"
  },
  "nl": {
    "back": "Terug naar Home",
    "login": "Inloggen",
    "signup": "Aanmelden",
    "emailPhone": "E-mail of telefoonnummer",
    "email": "E-mailadres",
    "password": "Wachtwoord",
    "fullName": "Volledige Naam",
    "phone": "Telefoon / WhatsApp",
    "forgot": "Wachtwoord vergeten?",
    "signingIn": "Inloggen...",
    "creating": "Konto aanmaken...",
    "signIn": "Inloggen",
    "noMember": "Geen lid?",
    "signupNow": "registreer nu",
    "alreadyMember": "Al een account?",
    "signinNow": "nu inloggen",
    "invalidCredentials": "Ongeldig e-mailadres of wachtwoord.",
    "createFailed": "Aanmaken account mislukt.",
    "welcome": "Welkom",
    "accountCreated": "Account aangemaakt! Welkom"
  },
  "pl": {
    "back": "Wróć do strony głównej",
    "login": "Zaloguj się",
    "signup": "Zarejestruj się",
    "emailPhone": "E-mail lub telefon",
    "email": "Adres e-mail",
    "password": "Hasło",
    "fullName": "Imię i nazwisko",
    "phone": "Telefon / WhatsApp",
    "forgot": "Nie pamiętasz hasła?",
    "signingIn": "Logowanie...",
    "creating": "Tworzenie konta...",
    "signIn": "Zaloguj",
    "noMember": "Nie masz konta?",
    "signupNow": "zarejestruj się teraz",
    "alreadyMember": "Masz już konto?",
    "signinNow": "zaloguj się",
    "invalidCredentials": "Niepoprawny e-mail lub hasło.",
    "createFailed": "Nie udało się utworzyć konta.",
    "welcome": "Witaj",
    "accountCreated": "Konto zostało utworzone! Witaj"
  },
  "ro": {
    "back": "Înapoi la Pagina Principală",
    "login": "Autentificare",
    "signup": "Înregistrare",
    "emailPhone": "Email sau număr de telefon",
    "email": "Adresă de Email",
    "password": "Parolă",
    "fullName": "Nume Complet",
    "phone": "Telefon / WhatsApp",
    "forgot": "Ați uitat parola?",
    "signingIn": "Autentificare în curs...",
    "creating": "Creare cont...",
    "signIn": "Intră în cont",
    "noMember": "Nu aveți cont?",
    "signupNow": "înregistrați-vă acum",
    "alreadyMember": "Aveți deja un cont?",
    "signinNow": "autentificați-vă",
    "invalidCredentials": "Email sau parolă incorectă.",
    "createFailed": "Crearea contului a eșuat.",
    "welcome": "Bine ați venit",
    "accountCreated": "Cont creat cu succes! Bine ați venit"
  },
  "el": {
    "back": "Επιστροφή στην Αρχική",
    "login": "Σύνδεση",
    "signup": "Εγγραφή",
    "emailPhone": "Email ή αριθμός τηλεφώνου",
    "email": "Διεύθυνση Email",
    "password": "Κωδικός Πρόσβασης",
    "fullName": "Ονοματεπώνυμο",
    "phone": "Τηλέφωνο / WhatsApp",
    "forgot": "Ξεχάσατε τον κωδικό;",
    "signingIn": "Σύνδεση σε εξέλιξη...",
    "creating": "Δημιουργία λογαριασμού...",
    "signIn": "Σύνδεση",
    "noMember": "Δεν είστε μέλος;",
    "signupNow": "εγγραφείτε τώρα",
    "alreadyMember": "Έχετε ήδη λογαριασμό;",
    "signinNow": "συνδεθείτε τώρα",
    "invalidCredentials": "Μη έγκυρο email ή κωδικός πρόσβασης.",
    "createFailed": "Αποτυχία δημιουργίας λογαριασμού.",
    "welcome": "Καλώς ήρθατε",
    "accountCreated": "Ο λογαριασμός δημιουργήθηκε! Καλώς ήρθατε"
  },
  "sv": {
    "back": "Tillbaka till Hem",
    "login": "Logga in",
    "signup": "Skapa konto",
    "emailPhone": "E-post eller telefon",
    "email": "E-postadress",
    "password": "Lösenord",
    "fullName": "Fullständigt Namn",
    "phone": "Telefon / WhatsApp",
    "forgot": "Glömt lösenordet?",
    "signingIn": "Loggar in...",
    "creating": "Skapar konto...",
    "signIn": "Logga in",
    "noMember": "Inte medlem?",
    "signupNow": "registrera dig nu",
    "alreadyMember": "Redan medlem?",
    "signinNow": "logga in nu",
    "invalidCredentials": "Felaktig e-post eller lösenord.",
    "createFailed": "Kunde inte skapa konto.",
    "welcome": "Välkommen",
    "accountCreated": "Konto skapat! Välkommen"
  },
  "hi": {
    "back": "होम पर वापस जाएं",
    "login": "लॉग इन",
    "signup": "साइन अप",
    "emailPhone": "ईमेल या फ़ोन नंबर",
    "email": "ईमेल पता",
    "password": "पासवर्ड",
    "fullName": "पूरा नाम",
    "phone": "फ़ोन / व्हाट्सएप",
    "forgot": "पासवर्ड भूल गए?",
    "signingIn": "लॉग इन हो रहा है...",
    "creating": "खाता बनाया जा रहा है...",
    "signIn": "साइन इन करें",
    "noMember": "खाता नहीं है?",
    "signupNow": "अभी रजिस्टर करें",
    "alreadyMember": "पहले से खाता है?",
    "signinNow": "अभी साइन इन करें",
    "invalidCredentials": "अमान्य ईमेल या पासवर्ड।",
    "createFailed": "खाता बनाने में विफल।",
    "welcome": "स्वागत है",
    "accountCreated": "खाता बन गया! स्वागत है"
  },
  "ja": {
    "back": "ホームに戻る",
    "login": "ログイン",
    "signup": "新規登録",
    "emailPhone": "メールアドレスまたは電話番号",
    "email": "メールアドレス",
    "password": "パスワード",
    "fullName": "氏名",
    "phone": "電話番号 / WhatsApp",
    "forgot": "パスワードをお忘れですか？",
    "signingIn": "ログイン中...",
    "creating": "アカウント作成中...",
    "signIn": "サインイン",
    "noMember": "会員登録はお済みですか？",
    "signupNow": "新規登録する",
    "alreadyMember": "すでにアカウントをお持ちですか？",
    "signinNow": "ログインする",
    "invalidCredentials": "メールアドレスまたはパスワードが無効です。",
    "createFailed": "アカウントの作成に失敗しました。",
    "welcome": "ようこそ",
    "accountCreated": "アカウントが作成されました！ようこそ"
  },
  "ko": {
    "back": "홈으로 돌아가기",
    "login": "로그인",
    "signup": "회원가입",
    "emailPhone": "이메일 또는 전화번호",
    "email": "이메일 주소",
    "password": "비밀번호",
    "fullName": "성명",
    "phone": "전화번호 / WhatsApp",
    "forgot": "비밀번호를 잊으셨나요?",
    "signingIn": "로그인 중...",
    "creating": "계정 생성 중...",
    "signIn": "로그인",
    "noMember": "회원이 아니신가요?",
    "signupNow": "지금 가입하기",
    "alreadyMember": "이미 계정이 있으신가요?",
    "signinNow": "지금 로그인하기",
    "invalidCredentials": "잘못된 이메일 또는 비밀번호입니다.",
    "createFailed": "계정 생성에 실패했습니다.",
    "welcome": "환영합니다",
    "accountCreated": "계정이 성공적으로 생성되었습니다!"
  },
  "kk": {
    "back": "Басты бетке оралу",
    "login": "Кіру",
    "signup": "Тіркелу",
    "emailPhone": "Email немесе телефон",
    "email": "Электрондық пошта",
    "password": "Құпиясөз",
    "fullName": "Толық аты-жөні",
    "phone": "Телефон / WhatsApp",
    "forgot": "Құпиясөзді ұмыттыңыз ба?",
    "signingIn": "Кіру жүруде...",
    "creating": "Тіркелу жүруде...",
    "signIn": "Кіру",
    "noMember": "Тіркелмегенсіз бе?",
    "signupNow": "қазір тіркелу",
    "alreadyMember": "Аккаунтыңыз бар ма?",
    "signinNow": "қазір кіру",
    "invalidCredentials": "Email немесе құпиясөз қате.",
    "createFailed": "Аккаунт құру сәтсіз аяқталды.",
    "welcome": "Қош келдіңіз",
    "accountCreated": "Аккаунт құрылды! Қош келдіңіз"
  },
  "sr": {
    "back": "Назад на почетну",
    "login": "Пријава",
    "signup": "Регистрација",
    "emailPhone": "Имејл или телефон",
    "email": "Имејл адреса",
    "password": "Лозинка",
    "fullName": "Име и презиме",
    "phone": "Телефон / WhatsApp",
    "forgot": "Заборавили сте лозинку?",
    "signingIn": "Пријављивање...",
    "creating": "Креирање налога...",
    "signIn": "Пријавите се",
    "noMember": "Немате налог?",
    "signupNow": "региструјте се сада",
    "alreadyMember": "Већ имате налог?",
    "signinNow": "пријавите се сада",
    "invalidCredentials": "Неисправан имејл или лозинка.",
    "createFailed": "Креирање налога није успело.",
    "welcome": "Добродошли",
    "accountCreated": "Налог је креиран! Добродошли"
  },
  "hr": {
    "back": "Natrag na početnu",
    "login": "Prijava",
    "signup": "Registracija",
    "emailPhone": "E-mail ili telefon",
    "email": "E-mail adresa",
    "password": "Lozinka",
    "fullName": "Ime i prezime",
    "phone": "Telefon / WhatsApp",
    "forgot": "Zaboravili ste lozinku?",
    "signingIn": "Prijavljivanje...",
    "creating": "Izrada računa...",
    "signIn": "Prijavite se",
    "noMember": "Nemate račun?",
    "signupNow": "registrirajte se sada",
    "alreadyMember": "Već imate račun?",
    "signinNow": "prijavite se sada",
    "invalidCredentials": "Neispravan e-mail ili lozinka.",
    "createFailed": "Izrada računa nije uspjela.",
    "welcome": "Dobrodošli",
    "accountCreated": "Račun je izrađen! Dobrodošli"
  },
  "bs": {
    "back": "Nazad na početnu",
    "login": "Prijava",
    "signup": "Registracija",
    "emailPhone": "E-mail ili telefon",
    "email": "E-mail adresa",
    "password": "Lozinka",
    "fullName": "Ime i prezime",
    "phone": "Telefon / WhatsApp",
    "forgot": "Zaboravili ste lozinku?",
    "signingIn": "Prijavljivanje...",
    "creating": "Kreiranje računa...",
    "signIn": "Prijavite se",
    "noMember": "Nemate račun?",
    "signupNow": "registrujte se sada",
    "alreadyMember": "Već imate račun?",
    "signinNow": "prijavite se sada",
    "invalidCredentials": "Neispravan e-mail ili lozinka.",
    "createFailed": "Kreiranje računa nije uspjelo.",
    "welcome": "Dobrodošli",
    "accountCreated": "Račun je kreiran! Dobrodošli"
  },
  "sq": {
    "back": "Kthehu në Fillim",
    "login": "Identifikohu",
    "signup": "Regjistrohu",
    "emailPhone": "Email ose telefon",
    "email": "Adresa Email",
    "password": "Fjalëkalimi",
    "fullName": "Emri dhe Mbiemri",
    "phone": "Telefon / WhatsApp",
    "forgot": "Keni harruar fjalëkalimin?",
    "signingIn": "Po identifikoheni...",
    "creating": "Po krijohet llogaria...",
    "signIn": "Hyr",
    "noMember": "Nuk keni llogari?",
    "signupNow": "regjistrohuni tani",
    "alreadyMember": "Keni një llogari?",
    "signinNow": "hyni tani",
    "invalidCredentials": "Email ose fjalëkalim i pasaktë.",
    "createFailed": "Krijimi i llogarisë dështoi.",
    "welcome": "Mirë se vini",
    "accountCreated": "Llogaria u krijua! Mirë se vini"
  },
  "bg": {
    "back": "Назад към началото",
    "login": "Вход",
    "signup": "Регистрация",
    "emailPhone": "Имейл или телефон",
    "email": "Имейл адрес",
    "password": "Парола",
    "fullName": "Пълно име",
    "phone": "Телефон / WhatsApp",
    "forgot": "Забравена парола?",
    "signingIn": "Влизане...",
    "creating": "Създаване на профил...",
    "signIn": "Вход",
    "noMember": "Нямате профил?",
    "signupNow": "регистрирайте се сега",
    "alreadyMember": "Вече имате профил?",
    "signinNow": "влезте сега",
    "invalidCredentials": "Невалиден имейл или парола.",
    "createFailed": "Неуспешно създаване на профил.",
    "welcome": "Добре дошли",
    "accountCreated": "Профилът е създаден! Добре дошли"
  }
};

const RECOVERY_COPY: Record<string, { title: string; newPassword: string; save: string; email: string; back: string; wait: string; saved: string }> = {
  "en": {
    "title": "Reset password",
    "newPassword": "New password",
    "save": "Save new password",
    "email": "Email reset link",
    "back": "Back to sign in",
    "wait": "Please wait…",
    "saved": "Password updated. You can sign in now."
  },
  "en-GB": {
    "title": "Reset password",
    "newPassword": "New password",
    "save": "Save new password",
    "email": "Email reset link",
    "back": "Back to sign in",
    "wait": "Please wait…",
    "saved": "Password updated. You can sign in now."
  },
  "en-US": {
    "title": "Reset password",
    "newPassword": "New password",
    "save": "Save new password",
    "email": "Email reset link",
    "back": "Back to sign in",
    "wait": "Please wait…",
    "saved": "Password updated. You can sign in now."
  },
  "ar": {
    "title": "إعادة تعيين كلمة المرور",
    "newPassword": "كلمة المرور الجديدة",
    "save": "حفظ كلمة المرور",
    "email": "إرسال رابط الاستعادة",
    "back": "العودة لتسجيل الدخول",
    "wait": "يرجى الانتظار…",
    "saved": "تم تحديث كلمة المرور. يمكنك تسجيل الدخول الآن."
  },
  "ckb": {
    "title": "نوێکردنەوەی وشەی نهێنی",
    "newPassword": "وشەی نهێنیی نوێ",
    "save": "پاشەکەوتکردنی وشەی نهێنی",
    "email": "ناردنی بەستەری نوێکردنەوە",
    "back": "گەڕانەوە بۆ چوونەژوورەوە",
    "wait": "تکایە چاوەڕێ بکە…",
    "saved": "وشەی نهێنی نوێکرایەوە. ئێستا دەتوانیت بچیتە ژوورەوە."
  },
  "kmr": {
    "title": "Şîfreyê nû bike",
    "newPassword": "Şîfreya nû",
    "save": "Şîfreya nû tomar bike",
    "email": "Girêdana nûkirinê bişîne",
    "back": "Vegere têketinê",
    "wait": "Ji kerema xwe bisekine…",
    "saved": "Şîfre hat nûkirin. Niha dikarî têkevî."
  },
  "tr": {
    "title": "Şifreyi sıfırla",
    "newPassword": "Yeni şifre",
    "save": "Yeni şifreyi kaydet",
    "email": "Sıfırlama bağlantısı gönder",
    "back": "Girişe dön",
    "wait": "Lütfen bekleyin…",
    "saved": "Şifre güncellendi. Şimdi giriş yapabilirsiniz."
  },
  "de": {
    "title": "Passwort zurücksetzen",
    "newPassword": "Neues Passwort",
    "save": "Neues Passwort speichern",
    "email": "Link per E-Mail senden",
    "back": "Zurück zur Anmeldung",
    "wait": "Bitte warten…",
    "saved": "Passwort aktualisiert. Sie können sich jetzt anmelden."
  },
  "fr": {
    "title": "Réinitialiser le mot de passe",
    "newPassword": "Nouveau mot de passe",
    "save": "Enregistrer",
    "email": "Envoyer le lien",
    "back": "Retour à la connexion",
    "wait": "Veuillez patienter…",
    "saved": "Mot de passe mis à jour. Vous pouvez vous connecter."
  },
  "it": {
    "title": "Reimposta password",
    "newPassword": "Nuova password",
    "save": "Salva nuova password",
    "email": "Invia link di recupero",
    "back": "Torna all'accesso",
    "wait": "Attendere prego…",
    "saved": "Password aggiornata. Ora puoi accedere."
  },
  "es": {
    "title": "Restablecer contraseña",
    "newPassword": "Nueva contraseña",
    "save": "Guardar contraseña",
    "email": "Enviar enlace",
    "back": "Volver a iniciar sesión",
    "wait": "Espere por favor…",
    "saved": "Contraseña actualizada. Ya puede iniciar sesión."
  },
  "es-MX": {
    "title": "Restablecer contraseña",
    "newPassword": "Nueva contraseña",
    "save": "Guardar contraseña",
    "email": "Enviar enlace",
    "back": "Volver a iniciar sesión",
    "wait": "Espere por favor…",
    "saved": "Contraseña actualizada. Ya puede iniciar sesión."
  },
  "pt": {
    "title": "Redefinir palavra-passe",
    "newPassword": "Nova palavra-passe",
    "save": "Guardar palavra-passe",
    "email": "Enviar ligação",
    "back": "Voltar à entrada",
    "wait": "Aguarde por favor…",
    "saved": "Palavra-passe atualizada. Pode agora iniciar sessão."
  },
  "pt-BR": {
    "title": "Redefinir senha",
    "newPassword": "Nova senha",
    "save": "Salvar nova senha",
    "email": "Enviar link por e-mail",
    "back": "Voltar ao login",
    "wait": "Aguarde por favor…",
    "saved": "Senha atualizada. Você já pode entrar."
  },
  "fa": {
    "title": "بازیابی رمز عبور",
    "newPassword": "رمز عبور جدید",
    "save": "ذخیره رمز جدید",
    "email": "ارسال لینک بازیابی",
    "back": "بازگشت به ورود",
    "wait": "لطفاً صبر کنید…",
    "saved": "رمز عبور به‌روزرسانی شد. اکنون می‌توانید وارد شوید."
  },
  "ru": {
    "title": "Сброс пароля",
    "newPassword": "Новый пароль",
    "save": "Сохранить пароль",
    "email": "Отправить ссылку",
    "back": "Вернуться ко входу",
    "wait": "Пожалуйста, подождите…",
    "saved": "Пароль обновлен. Теперь вы можете войти."
  },
  "zh-CN": {
    "title": "重置密码",
    "newPassword": "新密码",
    "save": "保存新密码",
    "email": "发送重置链接",
    "back": "返回登录",
    "wait": "请稍候…",
    "saved": "密码已成功更新，您现在可以登录了。"
  },
  "nl": {
    "title": "Wachtwoord opnieuw instellen",
    "newPassword": "Nieuw wachtwoord",
    "save": "Opslaan",
    "email": "Verstuur link",
    "back": "Terug naar inloggen",
    "wait": "Even geduld…",
    "saved": "Wachtwoord bijgewerkt. U kunt nu inloggen."
  },
  "pl": {
    "title": "Resetuj hasło",
    "newPassword": "Nowe hasło",
    "save": "Zapisz hasło",
    "email": "Wyślij link",
    "back": "Wróć do logowania",
    "wait": "Proszę czekać…",
    "saved": "Hasło zostało zaktualizowane. Możesz się zalogować."
  },
  "ro": {
    "title": "Resetare parolă",
    "newPassword": "Parolă nouă",
    "save": "Salvează parola",
    "email": "Trimite link-ul",
    "back": "Înapoi la autentificare",
    "wait": "Vă rugăm așteptați…",
    "saved": "Parola a fost actualizată. Vă puteți autentifica acum."
  },
  "el": {
    "title": "Επαναφορά κωδικού",
    "newPassword": "Νέος κωδικός",
    "save": "Αποθήκευση κωδικού",
    "email": "Αποστολή συνδέσμου",
    "back": "Επιστροφή στη σύνδεση",
    "wait": "Παρακαλώ περιμένετε…",
    "saved": "Ο κωδικός ενημερώθηκε. Μπορείτε να συνδεθείτε τώρα."
  },
  "sv": {
    "title": "Återställ lösenord",
    "newPassword": "Nytt lösenord",
    "save": "Spara lösenord",
    "email": "Skicka återställningslänk",
    "back": "Tillbaka till inloggning",
    "wait": "Vänligen vänta…",
    "saved": "Lösenordet har uppdaterats. Du kan logga in nu."
  },
  "hi": {
    "title": "पासवर्ड रीसेट करें",
    "newPassword": "नया पासवर्ड",
    "save": "पासवर्ड सुरक्षित करें",
    "email": "रीसेट लिंक भेजें",
    "back": "लॉग इन पर वापस जाएं",
    "wait": "कृपया प्रतीक्षा करें…",
    "saved": "पासवर्ड अपडेट हो गया। अब आप साइन इन कर सकते हैं।"
  },
  "ja": {
    "title": "パスワードの再設定",
    "newPassword": "新しいパスワード",
    "save": "新しいパスワードを保存",
    "email": "再設定リンクを送信",
    "back": "ログインに戻る",
    "wait": "少々お待ちください…",
    "saved": "パスワードが更新されました。ログインできます。"
  },
  "ko": {
    "title": "비밀번호 재설정",
    "newPassword": "새 비밀번호",
    "save": "새 비밀번호 저장",
    "email": "재설정 링크 전송",
    "back": "로그인으로 돌아가기",
    "wait": "잠시만 기다려주세요…",
    "saved": "비밀번호가 업데이트되었습니다. 이제 로그인할 수 있습니다."
  },
  "kk": {
    "title": "Құпиясөзді қалпына келтіру",
    "newPassword": "Жаңа құпиясөз",
    "save": "Сақтау",
    "email": "Сілтемені жіберу",
    "back": "Кіруге оралу",
    "wait": "Күте тұрыңыз…",
    "saved": "Құпиясөз жаңартылды. Енді жүйеге кіре аласыз."
  },
  "sr": {
    "title": "Ресетовање лозинке",
    "newPassword": "Нова лозинка",
    "save": "Сачувај лозинку",
    "email": "Пошаљи линк",
    "back": "Назад на пријаву",
    "wait": "Сачекајте…",
    "saved": "Лозинка је ажурирана. Сада се можете пријавити."
  },
  "hr": {
    "title": "Ponovno postavljanje lozinke",
    "newPassword": "Nova lozinka",
    "save": "Spremi lozinku",
    "email": "Pošalji poveznicu",
    "back": "Natrag na prijavu",
    "wait": "Pričekajte…",
    "saved": "Lozinka je ažurirana. Sada se možete prijaviti."
  },
  "bs": {
    "title": "Resetovanje lozinke",
    "newPassword": "Nova lozinka",
    "save": "Spasi lozinku",
    "email": "Pošalji link",
    "back": "Nazad na prijavu",
    "wait": "Pričekajte…",
    "saved": "Lozinka je ažurirana. Sada se možete prijaviti."
  },
  "sq": {
    "title": "Rivendos fjalëkalimin",
    "newPassword": "Fjalëkalimi i ri",
    "save": "Ruaj fjalëkalimin",
    "email": "Dërgo lidhjen",
    "back": "Kthehu te hyrja",
    "wait": "Ju lutem prisni…",
    "saved": "Fjalëkalimi u përditësua. Tani mund të identifikoheni."
  },
  "bg": {
    "title": "Възстановяване на парола",
    "newPassword": "Нова парола",
    "save": "Запазване на парола",
    "email": "Изпрати линк",
    "back": "Назад към входа",
    "wait": "Моля изчакайте…",
    "saved": "Паролата е обновена. Вече можете да влезете."
  }
};

export const UserAuthPage: React.FC<UserAuthPageProps> = ({
  onBackToHome,
  onAuthSuccess,
  onNavigateToAdmin,
  onNavigateToShop
}) => {
  const { currentLanguage, t } = useLanguage();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const copy = AUTH_COPY_BY_LANG[currentLanguage.code] || AUTH_COPY_BY_LANG[currentLanguage.code.split('-')[0]] || AUTH_COPY_BY_LANG.en;
  const recoveryCopy = RECOVERY_COPY[currentLanguage.code] || RECOVERY_COPY[currentLanguage.code.split('-')[0]] || RECOVERY_COPY.en;

  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get('reset'));
  const [isRecovering, setIsRecovering] = useState(false);

  // Form states with NO pre-hardcoded emails or values
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<UserType | null>(() => getCurrentUser());

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Purge any stale legacy winhome sessions
    const user = getCurrentUser();
    if (user && (user.email?.toLowerCase().includes('winhome') || user.name?.toLowerCase().includes('winhome'))) {
      logoutUser();
      setCurrentUser(null);
    }

    const handleAuth = () => setCurrentUser(getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setEmailOrPhone('');
    setPassword('');
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await loginUser({ email: emailOrPhone.trim(), password: password.trim() });
      setSuccessMsg(`${copy.welcome}, ${user.name}!`);
      if (onAuthSuccess) onAuthSuccess(user);
      if (user.role === 'admin' && onNavigateToAdmin) {
        setTimeout(() => onNavigateToAdmin(), 600);
      } else {
        setTimeout(() => onBackToHome(), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || copy.invalidCredentials);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const user = await registerUser({
        name: emailOrPhone.trim().split('@')[0],
        email: emailOrPhone.trim(),
        password: password.trim(),
        role: 'client'
      });
      setSuccessMsg(`${copy.accountCreated}, ${user.name}.`);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => onBackToHome(), 700);
    } catch (err: any) {
      setErrorMsg(err.message || copy.createFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg(null); setSuccessMsg(null); setLoading(true);
    try {
      if (resetToken) {
        await resetPassword(resetToken, password);
        setSuccessMsg(recoveryCopy.saved);
        setResetToken(null); setIsRecovering(false); setPassword('');
        history.replaceState(null, '', `${window.location.pathname}#auth`);
      } else {
        setSuccessMsg(await requestPasswordReset(emailOrPhone.trim()));
      }
    } catch (error: any) { setErrorMsg(error.message || 'Recovery failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="neumorphic-page-container" dir="ltr">
      <button type="button" onClick={() => setIsLanguageModalOpen(true)} aria-label="Change language" className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-[#dde1e7] px-3 py-2 text-xs font-bold text-[#595959] shadow-[-2px_-2px_5px_#ffffff73,2px_2px_5px_rgba(94,104,121,0.25)]">
        <Globe size={15} aria-hidden="true" />
        {currentLanguage.flagImage ? <img src={currentLanguage.flagImage} alt="" className="h-4 w-6 rounded-sm object-cover" /> : <span>{currentLanguage.flag}</span>}
        <span>{currentLanguage.nativeName}</span>
      </button>

      <button
        type="button"
        onClick={onBackToHome}
        className="neumorphic-back-btn"
        title={copy.back}
      >
        <ArrowLeft size={16} />
        <span>{copy.back}</span>
      </button>

      {/* From Uiverse.io by Harsha2lucky */}
      <div className="content">
        <div className="text">
          {currentUser && !resetToken && !isRecovering
            ? currentUser.name
            : resetToken || isRecovering
            ? recoveryCopy.title
            : isLogin
            ? copy.login
            : copy.signup}
        </div>

        {errorMsg && (
          <div className="neumorphic-alert error">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="neumorphic-alert success">
            {successMsg}
          </div>
        )}

        {currentUser && !resetToken && !isRecovering ? (
          /* SIGNED IN PROFILE VIEW */
          <div className="space-y-4 pt-1 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg mb-2">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>{t('auth_signed_in') || 'You are signed in'}</span>
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#dde1e7] shadow-[inset_-2px_-2px_5px_#ffffff73,inset_2px_2px_5px_rgba(94,104,121,0.288)] text-left space-y-2">
              <div>
                <span className="text-[10px] font-bold text-[#595959] uppercase tracking-wider">{t('auth_account_name') || 'Account Name'}</span>
                <p className="text-sm font-extrabold text-[#333] truncate">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#595959] uppercase tracking-wider">{t('auth_email_address') || 'Email Address'}</span>
                <p className="text-sm font-medium text-[#333] truncate">{currentUser.email}</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#c5cad3]">
                <span className="text-[10px] font-bold text-[#595959] uppercase tracking-wider">{t('auth_account_role') || 'Account Role'}</span>
                <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50/80 px-2 py-0.5 rounded border border-red-200">
                  {currentUser.role === 'admin' ? (t('auth_super_admin') || 'Super Admin') : (t('auth_verified_badge') || 'Verified Client')}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 pt-2">
              {currentUser.role === 'admin' && onNavigateToAdmin && (
                <button
                  type="button"
                  onClick={onNavigateToAdmin}
                  className="btn2 w-full"
                >
                  <span className="spn2 flex items-center justify-center gap-2">
                    <Shield size={16} className="text-red-600" />
                    <span>{t('auth_open_admin') || 'Open Admin Dashboard'}</span>
                  </span>
                </button>
              )}

              {onNavigateToShop && (
                <button
                  type="button"
                  onClick={onNavigateToShop}
                  className="btn2 w-full"
                >
                  <span className="spn2 flex items-center justify-center gap-2">
                    <ShoppingBag size={16} className="text-blue-600" />
                    <span>{t('auth_browse_catalog') || 'Browse Product Catalog'}</span>
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="btn2 w-full !mt-3"
              >
                <span className="spn2 flex items-center justify-center gap-2 text-red-600">
                  <LogOut size={16} />
                  <span>{t('auth_sign_out') || 'Sign Out of Account'}</span>
                </span>
              </button>
            </div>
          </div>
        ) : (resetToken || isRecovering) ? (
          <form onSubmit={handleRecoverySubmit}>
            {!resetToken && <div className="field"><input required type="email" className={`input ${emailOrPhone ? 'has-val' : ''}`} value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} /><label className="label">{copy.email}</label></div>}
            {resetToken && <div className="field"><input required minLength={8} type="password" className={`input ${password ? 'has-val' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} /><label className="label">{recoveryCopy.newPassword}</label></div>}
            <button className="btn2" type="submit" disabled={loading}><span className="spn2">{loading ? recoveryCopy.wait : resetToken ? recoveryCopy.save : recoveryCopy.email}</span></button>
            <div className="sign-up"><a href="#login" onClick={(e) => { e.preventDefault(); setIsRecovering(false); setResetToken(null); }}>{recoveryCopy.back}</a></div>
          </form>
        ) : isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} autoComplete="off">
            {/* Decoy inputs to prevent browser autofill */}
            <input type="text" name="decoy_user_field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
            <input type="password" name="decoy_pass_field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

            <div className="field">
              <input
                required
                type="text"
                name="dh_account_user"
                id="dh_account_user"
                autoComplete="off"
                data-lpignore="true"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                className={`input ${emailOrPhone ? 'has-val' : ''}`}
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" />
                </svg>
              </span>
              <label className="label">{copy.emailPhone}</label>
            </div>

            <div className="field">
              <input
                required
                type="password"
                name="dh_account_pass"
                id="dh_account_pass"
                autoComplete="new-password"
                data-lpignore="true"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
                className={`input ${password ? 'has-val' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M336 192h-16v-64C320 57.406 262.594 0 192 0S64 57.406 64 128v64H48c-26.453 0-48 21.523-48 48v224c0 26.477 21.547 48 48 48h288c26.453 0 48-21.523 48-48V240c0-26.477-21.547-48-48-48zm-229.332-64c0-47.063 38.27-85.332 85.332-85.332s85.332 38.27 85.332 85.332v64H106.668zm0 0" />
                </svg>
              </span>
              <label className="label">{copy.password}</label>
            </div>

            <div className="forgot-pass">
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecovering(true);
                }}
              >
                {copy.forgot}
              </a>
            </div>

            {/* From Uiverse.io by TISEPSE */}
            <button className="btn2" type="submit" disabled={loading}>
              <span className="spn2">{loading ? copy.signingIn : copy.signIn}</span>
            </button>

            <div className="sign-up">
              {copy.noMember}
              <a
                href="#signup"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(false);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
              >
                {copy.signupNow}
              </a>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleRegisterSubmit} autoComplete="off">
            <div className="field">
              <input
                required
                type="email"
                name="dh_reg_email"
                autoComplete="off"
                data-lpignore="true"
                className={`input ${emailOrPhone ? 'has-val' : ''}`}
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M256 0c-74.439 0-135 60.561-135 135s60.561 135 135 135 135-60.561 135-135S330.439 0 256 0zM423.966 358.195C387.006 320.667 338.009 300 286 300h-60c-52.008 0-101.006 20.667-137.966 58.195C51.255 395.539 31 444.833 31 497c0 8.284 6.716 15 15 15h420c8.284 0 15-6.716 15-15 0-52.167-20.255-101.461-57.034-138.805z" />
                </svg>
              </span>
              <label className="label">{copy.email}</label>
            </div>

            <div className="field">
              <input
                required
                type="password"
                name="dh_reg_secret"
                minLength={8}
                autoComplete="new-password"
                data-lpignore="true"
                className={`input ${password ? 'has-val' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
              <span className="span">
                <svg viewBox="0 0 512 512" height="20" width="50" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#595959" d="M336 192h-16v-64C320 57.406 262.594 0 192 0S64 57.406 64 128v64H48c-26.453 0-48 21.523-48 48v224c0 26.477 21.547 48 48 48h288c26.453 0 48-21.523 48-48V240c0-26.477-21.547-48-48-48zm-229.332-64c0-47.063 38.27-85.332 85.332-85.332s85.332 38.27 85.332 85.332v64H106.668zm0 0" />
                </svg>
              </span>
              <label className="label">{copy.password}</label>
            </div>

            {/* From Uiverse.io by TISEPSE */}
            <button className="btn2" type="submit" disabled={loading}>
              <span className="spn2">{loading ? copy.creating : copy.signup}</span>
            </button>

            <div className="sign-up">
              {copy.alreadyMember}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(true);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
              >
                {copy.signinNow}
              </a>
            </div>
          </form>
        )}
      </div>
      <LanguageModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
    </div>
  );
};

export default UserAuthPage;
