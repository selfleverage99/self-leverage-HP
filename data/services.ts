export type ServiceIcon =
  | 'globe'
  | 'circuit'
  | 'dashboard'
  | 'ship'
  | 'building'
  | 'document'
  | 'headset'
  | 'power';

export interface Service {
  num: string;
  title: string;
  icon: ServiceIcon;
  body: {
    ja: string;
    en: string;
    vn: string;
  };
}

export const services: Service[] = [
  {
    num: '01',
    title: '海外進出支援',
    icon: 'globe',
    body: {
      ja: '日本企業およびベトナム企業の相互誘致、進出支援。国境を越えた新たな機会を創出します。',
      en: 'Mutual attraction and expansion support for Japanese and Vietnamese companies. Creating new opportunities across borders.',
      vn: 'Thu hút và hỗ trợ mở rộng lẫn nhau cho các doanh nghiệp Nhật Bản và Việt Nam. Tạo ra cơ hội mới vượt qua biên giới.',
    },
  },
  {
    num: '02',
    title: 'AI・ITシステム開発',
    icon: 'circuit',
    body: {
      ja: 'AI/IT システム開発。最先端技術でビジネスプロセスを革新します。',
      en: 'AI/IT System Development. Innovating business processes with cutting-edge technology.',
      vn: 'Phát triển hệ thống AI/CNTT. Đổi mới quy trình kinh doanh với công nghệ tiên tiến.',
    },
  },
  {
    num: '03',
    title: '中小企業向け管理ツール',
    icon: 'dashboard',
    body: {
      ja: '中小企業向け一元管理ツール提供。業務効率化と経営の可視化を実現します。',
      en: 'Provision of centralized management tools for SMEs. Achieving operational efficiency and management visualization.',
      vn: 'Cung cấp công cụ quản lý tập trung cho các doanh nghiệp vừa và nhỏ. Đạt được hiệu quả hoạt động và trực quan hóa quản lý.',
    },
  },
  {
    num: '04',
    title: '貿易・輸出入事業',
    icon: 'ship',
    body: {
      ja: '海外への輸出入。グローバルな物流ネットワークでビジネスを拡大します。',
      en: 'Import and export to overseas. Expanding business with a global logistics network.',
      vn: 'Xuất nhập khẩu ra nước ngoài. Mở rộng kinh doanh với mạng lưới logistics toàn cầu.',
    },
  },
  {
    num: '05',
    title: '不動産事業',
    icon: 'building',
    body: {
      ja: '国内外不動産。価値ある物件の売買・仲介・管理をサポートします。',
      en: 'Domestic and international real estate. Supporting the purchase, sale, brokerage, and management of valuable properties.',
      vn: 'Bất động sản trong và ngoài nước. Hỗ trợ mua bán, môi giới và quản lý các bất động sản giá trị.',
    },
  },
  {
    num: '06',
    title: '補助金・助成金サポート',
    icon: 'document',
    body: {
      ja: '各サービスに付随する補助金/助成金のご案内。お客様のニーズに合わせて柔軟に対応いたします。',
      en: 'Guidance on subsidies and grants related to each service. We respond flexibly to customer needs.',
      vn: 'Hướng dẫn về trợ cấp và tài trợ liên quan đến từng dịch vụ. Chúng tôi đáp ứng linh hoạt các nhu cầu của khách hàng.',
    },
  },
  {
    num: '07',
    title: 'テレアポ代行',
    icon: 'headset',
    body: {
      ja: '戦略的なテレアポ事業による新規顧客開拓サポート。',
      en: 'Strategic telemarketing support for new customer acquisition.',
      vn: 'Hỗ trợ tiếp thị qua điện thoại chiến lược để thu hút khách hàng mới.',
    },
  },
  {
    num: '08',
    title: '電気卸事業',
    icon: 'power',
    body: {
      ja: '小売電気事業者向けの料金プラン（パッケージ）作成から、契約管理などのバックヤード業務まで幅広くサポートします。',
      en: 'From building rate plans (packages) for retail electricity providers to back-office operations such as contract management, we provide broad support.',
      vn: 'Từ việc xây dựng các gói cước cho các nhà bán lẻ điện đến các nghiệp vụ hậu cần như quản lý hợp đồng, chúng tôi hỗ trợ toàn diện.',
    },
  },
];
