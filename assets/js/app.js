// ==========================================
// PDF 加载优化 - 针对中国用户网络优化
// ==========================================

class PDFLoaderOptimizer {
  constructor() {
    this.isChina = this.detectChinaRegion();
    this.pdfCache = new Map();
    this.init();
  }

  // 检测是否为中国用户（基于时区和语言）
  detectChinaRegion() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language || navigator.userLanguage;
      return timezone.includes('Shanghai') || language.startsWith('zh');
    } catch (e) {
      return navigator.language.startsWith('zh');
    }
  }

  // 初始化PDF链接优化
  init() {
    this.setupPDFLinks();
    this.addGlobalLoadingIndicator();
  }

  // 设置PDF链接拦截
  setupPDFLinks() {
    document.querySelectorAll('a[href*=".pdf"]').forEach(link => {
      link.classList.add('pdf-link');
      
      // 中国用户显示加载提示
      if (this.isChina) {
        link.addEventListener('click', (e) => this.handlePDFClick(e, link));
        link.addEventListener('mouseenter', () => this.preloadPDF(link.href));
      }
    });
  }

  // 处理PDF点击 - 直接跳转
  handlePDFClick(e, link) {
    // 直接打开，无需显示加载提示框
    return true;
  }

  // 检测网络速度（简易版）
  isSlowNetwork() {
    if (navigator.connection) {
      const conn = navigator.connection;
      // 4G及以下认为是较慢网络
      return conn.effectiveType !== '4g' && conn.effectiveType !== 'wifi';
    }
    return false;
  }



  // PDF预加载（鼠标悬停时触发）
  preloadPDF(url) {
    if (this.pdfCache.has(url)) return;

    // 创建隐藏的iframe进行预加载
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.display = 'none';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    
    document.body.appendChild(iframe);
    this.pdfCache.set(url, iframe);

    // 30秒后移除预加载的iframe（节省内存）
    setTimeout(() => {
      if (this.pdfCache.has(url)) {
        iframe.remove();
        this.pdfCache.delete(url);
      }
    }, 30000);
  }

  // 添加PDF链接基础样式
  addGlobalLoadingIndicator() {
    const style = document.createElement('style');
    style.textContent = `
      .pdf-link {
        transition: all 0.3s ease;
      }

      .pdf-link:hover {
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  new PDFLoaderOptimizer();
});

// 原有的主题切换代码
const btn = document.getElementById("themeBtn");

if (btn) {
  let dark = false;

  btn.onclick = () => {
    dark = !dark;

    if (dark) {
      document.body.style.background = "#0f172a";
      document.body.style.color = "white";
      btn.innerHTML = "☀️";
    } else {
      document.body.style.background = "#f4f6fa";
      document.body.style.color = "#222";
      btn.innerHTML = "🌙";
    }
  };
}

// 搜索功能
const searchEl = document.getElementById("search");
if (searchEl) {
  searchEl.addEventListener("keyup", (e) => {
    console.log("Search:", e.target.value);
  });
}
