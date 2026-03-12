// 引入所需模块
const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// 定义基础配置
const BASE_URL = 'https://oss.metrolinehub.com/logo/'; // 图片基础URL
const SAVE_DIR = './metro_icons'; // 图片保存目录
const TIMEOUT = 10000; // 下载超时时间（10秒）

const lang = 'zh'; // 语言设置（'zh' 或 'en'）
// 你的地铁城市数据
const metroCitiesData = [
    {
      name: lang === 'zh' ? '北京地铁' : 'Beijing Subway',
      id: 65,
      code: 'beijing',
      iconSrc: '/beijing_icon.jpg'
    },
    {
      name: lang === 'zh' ? '上海地铁' : 'Shanghai Metro',
      id: 86,
      code: 'shanghai',
      iconSrc: '/shanghai_icon.jpg'
    },
    {
      name: lang === 'zh' ? '广州地铁' : 'Guangzhou Metro',
      id: 73,
      code: 'guangzhou',
      iconSrc: '/guangzhou_icon.jpg'
    },
    {
      name: lang === 'zh' ? '深圳地铁' : 'Shenzhen Metro',
      id: 88,
      code: 'shenzhen',
      iconSrc: '/shenzhen_icon.jpg'
    },
    {
      name: lang === 'zh' ? '成都地铁' : 'Chengdu Metro',
      id: 68,
      code: 'chengdu',
      iconSrc: '/chengdu_icon.png'
    },
    {
      name: lang === 'zh' ? '武汉地铁' : 'Wuhan Metro',
      id: 94,
      code: 'wuhan',
      iconSrc: '/wuhan_icon.jpg'
    },
    {
      name: lang === 'zh' ? '西安地铁' : "Xi'an Metro",
      id: 97,
      code: 'xian',
      iconSrc: '/xian_icon.jpg'
    },
    {
      name: lang === 'zh' ? '重庆地铁' : 'Chongqing Metro',
      id: 69,
      code: 'chongqing',
      iconSrc: '/chongqing_icon.png'
    },
    {
      name: lang === 'zh' ? '南京地铁' : 'Nanjing Metro',
      id: 82,
      code: 'nanjing',
      iconSrc: '/nanjing_icon.jpg'
    },
    {
      name: lang === 'zh' ? '杭州地铁' : 'Hangzhou Metro',
      id: 75,
      code: 'hangzhou',
      iconSrc: '/hangzhou_icon.jpg'
    },
    {
      name: lang === 'zh' ? '厦门地铁' : 'Xiamen Metro',
      id: 96,
      code: 'xiamen',
      iconSrc: '/xiamen_icon.jpg'
    },
    {
      name: lang === 'zh' ? '苏州地铁' : 'Suzhou Metro',
      id: 90,
      code: 'suzhou',
      iconSrc: '/suzhou_icon.png'
    },
    {
      name: lang === 'zh' ? '长沙地铁' : 'Changsha Metro',
      id: 67,
      code: 'changsha',
      iconSrc: '/changsha_icon.jpg'
    },
    {
      name: lang === 'zh' ? '天津地铁' : 'Tianjin Metro',
      id: 91,
      code: 'tianjin',
      iconSrc: '/tianjin_icon.jpg'
    },
    {
      name: lang === 'zh' ? '郑州地铁' : 'Zhengzhou Metro',
      id: 98,
      code: 'zhengzhou',
      iconSrc: '/zhengzhou_icon.jpg'
    },
    {
      name: lang === 'zh' ? '东莞地铁' : 'Dongguan Metro',
      id: 71,
      code: 'dongguan',
      iconSrc: '/dongguan_icon.png'
    },
    {
      name: lang === 'zh' ? '济南地铁' : 'Jinan Metro',
      id: 79,
      code: 'jinan',
      iconSrc: '/jinan_icon.jpg'
    },
    {
      name: lang === 'zh' ? '佛山地铁' : 'Foshan Metro',
      id: 104,
      code: 'foshan',
      iconSrc: '/foshan_icon.png'
    },
    {
      name: lang === 'zh' ? '合肥地铁' : 'Hefei Metro',
      id: 77,
      code: 'hefei',
      iconSrc: '/hefei_icon.png'
    },
    {
      name: lang === 'zh' ? '大连地铁' : 'Dalian Metro',
      id: 70,
      code: 'dalian',
      iconSrc: '/dalian_icon.jpg'
    },
    {
      name: lang === 'zh' ? '沈阳地铁' : 'Shenyang Metro',
      id: 87,
      code: 'shenyang',
      iconSrc: '/shenyang_icon.jpg'
    },
    {
      name: lang === 'zh' ? '青岛地铁' : 'Qingdao Metro',
      id: 85,
      code: 'qingdao',
      iconSrc: '/qingdao_icon.jpg'
    },
    {
      name: lang === 'zh' ? '常州地铁' : 'Changzhou Metro',
      id: 101,
      code: 'changzhou',
      iconSrc: '/changzhou_icon.png'
    },
    {
      name: lang === 'zh' ? '无锡地铁' : 'Wuxi Metro',
      id: 95,
      code: 'wuxi',
      iconSrc: '/wuxi_icon.jpg'
    },
    {
      name: lang === 'zh' ? '福州地铁' : 'Fuzhou Metro',
      id: 72,
      code: 'fuzhou',
      iconSrc: '/fuzhou_icon.png'
    },
    {
      name: lang === 'zh' ? '南昌地铁' : 'Nanchang Metro',
      id: 81,
      code: 'nanchang',
      iconSrc: '/nanchang_icon.png'
    },
    {
      name: lang === 'zh' ? '南宁地铁' : 'Nanning Metro',
      id: 83,
      code: 'nanning',
      iconSrc: '/nanning_icon.jpg'
    },
    {
      name: lang === 'zh' ? '徐州地铁' : 'Xuzhou Metro',
      id: 117,
      code: 'xuzhou',
      iconSrc: '/xuzhou_icon.jpg'
    },
    {
      name: lang === 'zh' ? '宁波地铁' : 'Ningbo Metro',
      id: 84,
      code: 'ningbo',
      iconSrc: '/ningbo_icon.jpg'
    },
    {
      name: lang === 'zh' ? '太原地铁' : 'Taiyuan Metro',
      id: 111,
      code: 'taiyuan',
      iconSrc: '/taiyuan_icon.jpg'
    },
    {
      name: lang === 'zh' ? '洛阳地铁' : 'Luoyang Metro',
      id: 108,
      code: 'luoyang',
      iconSrc: '/luoyang_icon.png'
    },
    {
      name: lang === 'zh' ? '贵阳地铁' : 'Guiyang Metro',
      id: 74,
      code: 'guiyang',
      iconSrc: '/guiyang_icon.png'
    },
    {
      name: lang === 'zh' ? '长春地铁' : 'Changchun Metro',
      id: 66,
      code: 'guiyang', // 原数据疑似笔误，如需要可改成 changchun
      iconSrc: '/changchun_icon.jpg'
    },
    {
      name: lang === 'zh' ? '昆明地铁' : 'Kunming Metro',
      id: 80,
      code: 'kunming',
      iconSrc: '/kunming_icon.jpg'
    },
    {
      name: lang === 'zh' ? '温州地铁' : 'Wenzhou Metro',
      id: 93,
      code: 'wenzhou',
      iconSrc: '/wenzhou_icon.png'
    },
    {
      name: lang === 'zh' ? '兰州地铁' : 'Lanzhou Metro',
      id: 107,
      code: 'lanzhou',
      iconSrc: '/lanzhou_icon.jpg'
    },
    {
      name: lang === 'zh' ? '绍兴地铁' : 'Shaoxing Metro',
      id: 110,
      code: 'shaoxing',
      iconSrc: '/shaoxing_icon.jpg'
    },
    {
      name: lang === 'zh' ? '哈尔滨地铁' : 'Harbin Metro',
      id: 76,
      code: 'haerbin',
      iconSrc: '/haerbin_icon.jpg'
    },
    {
      name: lang === 'zh' ? '石家庄地铁' : 'Shijiazhuang Metro',
      id: 89,
      code: 'shijiazhuang',
      iconSrc: '/shijiazhuang_icon.jpg'
    },
    {
      name: lang === 'zh' ? '乌鲁木齐地铁' : 'Urumqi Metro',
      id: 92,
      code: 'wulumuqi',
      iconSrc: '/wulumuqi_icon.png'
    },
    {
      name: lang === 'zh' ? '呼和浩特地铁' : 'Hohhot Metro',
      id: 105,
      code: 'huhehaote',
      iconSrc: '/huhehaote_icon.jpg'
    },
    {
      name: lang === 'zh' ? '香港地铁' : 'Hong Kong Metro',
      id: 78,
      code: 'hongkong',
      iconSrc: '/hongkong_icon.jpg'
    },
    {
      name: lang === 'zh' ? '澳门地铁' : 'Macau Metro',
      id: 100,
      code: 'macau',
      iconSrc: '/aomen_icon.png'
    },
    {
      name: lang === 'zh' ? '台湾地铁' : 'Taiwan Metro',
      id: 57,
      code: 'taiwan',
      iconSrc: '/taiwan_icon.png'
    },
    {
      name: lang === 'zh' ? '全国地铁' : 'National Metro',
      id: 22,
      code: 'china',
      iconSrc: '/quanguo_icon.jpg'
    }
  ]

// 封装下载函数（Promise 版）
const downloadImage = async (url, savePath) => {
  return new Promise((resolve, reject) => {
    // 创建请求
    const request = https.get(url, { timeout: TIMEOUT }, (response) => {
      // 处理HTTP错误状态码
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败：${url}，状态码：${response.statusCode}`));
        response.resume(); // 释放资源
        return;
      }

      // 创建文件写入流
      const fileStream = fs.createWriteStream(savePath);
      response.pipe(fileStream);

      // 监听写入完成
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(savePath));
      });

      // 监听写入错误
      fileStream.on('error', (err) => {
        fs.unlink(savePath, () => {}); // 删除已写入的不完整文件
        reject(new Error(`写入文件失败：${savePath}，错误：${err.message}`));
      });
    });

    // 监听请求超时
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`下载超时：${url}（超时时间：${TIMEOUT/1000}秒）`));
    });

    // 监听请求错误
    request.on('error', (err) => {
      reject(new Error(`请求失败：${url}，错误：${err.message}`));
    });
  });
};

// 批量下载主函数
const batchDownloadIcons = async () => {
  try {
    // 1. 创建保存目录（不存在则创建）
    if (!fs.existsSync(SAVE_DIR)) {
      fs.mkdirSync(SAVE_DIR, { recursive: true });
      console.log(`✅ 创建保存目录：${SAVE_DIR}`);
    }

    // 2. 遍历所有城市数据，逐个下载
    const successList = [];
    const failList = [];

    for (const city of metroCitiesData) {
      try {
        // 拼接完整图片URL
        const iconName = city.iconSrc.replace('/', ''); // 去掉开头的/，如 ningbo_icon.jpg
        const fullUrl = `${BASE_URL}${iconName}`;
        
        // 定义保存路径（用城市code命名，保留原后缀）
        const ext = path.extname(iconName); // 获取文件后缀（.jpg/.png）
        const saveFileName = `${city.code}${ext}`; // 如 ningbo.jpg
        const savePath = path.join(SAVE_DIR, saveFileName);

        // 跳过已存在的文件
        if (fs.existsSync(savePath)) {
          console.log(`⏩ ${city.name}：文件已存在，跳过下载`);
          successList.push({ city: city.name, path: savePath });
          continue;
        }

        // 开始下载
        console.log(`📥 正在下载：${city.name} (${fullUrl})`);
        await downloadImage(fullUrl, savePath);
        console.log(`✅ 下载完成：${city.name} → ${saveFileName}`);
        successList.push({ city: city.name, path: savePath });
      } catch (err) {
        console.log(`❌ 下载失败：${city.name} → ${err.message}`);
        failList.push({ city: city.name, error: err.message });
      }

      // 延迟100ms，避免请求过快被限制
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 3. 输出下载统计
    console.log('\n==================== 下载统计 ====================');
    console.log(`✅ 成功下载：${successList.length} 个`);
    console.log(`❌ 下载失败：${failList.length} 个`);
    
    if (failList.length > 0) {
      console.log('\n❌ 失败列表：');
      failList.forEach((item, index) => {
        console.log(`  ${index+1}. ${item.city}：${item.error}`);
      });
    }

    console.log(`\n📁 所有图片已保存至：${path.resolve(SAVE_DIR)}`);

  } catch (mainErr) {
    console.error('❌ 批量下载执行失败：', mainErr.message);
  }
};

// 执行批量下载
batchDownloadIcons();