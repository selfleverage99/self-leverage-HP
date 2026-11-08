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
    title: 'システム開発',
    icon: 'circuit',
    body: {
      ja: 'AI・ITシステムの開発。最先端技術で業務プロセスを革新し、ビジネスの成長を支えます。',
      en: 'AI and IT system development. Innovating business processes with cutting-edge technology to support growth.',
      vn: 'Phát triển hệ thống AI/CNTT. Đổi mới quy trình kinh doanh bằng công nghệ tiên tiến để hỗ trợ tăng trưởng.',
    },
  },
  {
    num: '02',
    title: '補助金',
    icon: 'document',
    body: {
      ja: '各種補助金・助成金のご案内から申請サポートまで。お客様のニーズに合わせて柔軟に対応いたします。',
      en: 'From guidance on subsidies and grants to application support. We respond flexibly to customer needs.',
      vn: 'Từ hướng dẫn về trợ cấp, tài trợ đến hỗ trợ nộp hồ sơ. Chúng tôi đáp ứng linh hoạt nhu cầu của khách hàng.',
    },
  },
  {
    num: '03',
    title: '電気卸',
    icon: 'power',
    body: {
      ja: '小売電気事業者向けの料金プラン（パッケージ）作成から、契約管理などのバックヤード業務まで幅広くサポートします。',
      en: 'From building rate plans (packages) for retail electricity providers to back-office operations such as contract management, we provide broad support.',
      vn: 'Từ việc xây dựng các gói cước cho các nhà bán lẻ điện đến các nghiệp vụ hậu cần như quản lý hợp đồng, chúng tôi hỗ trợ toàn diện.',
    },
  },
  {
    num: '04',
    title: 'テレアポ/営業代行',
    icon: 'headset',
    body: {
      ja: '戦略的なテレアポ・営業代行による新規顧客の開拓をサポートします。',
      en: 'Support for new customer acquisition through strategic telemarketing and sales outsourcing.',
      vn: 'Hỗ trợ thu hút khách hàng mới thông qua tiếp thị qua điện thoại và dịch vụ bán hàng thuê ngoài mang tính chiến lược.',
    },
  },
];
