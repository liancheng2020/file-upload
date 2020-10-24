import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class OssUpload extends Vue {
  @Prop() keySet: OssKeySet
  @Prop({ type: Boolean, default: false }) debug: boolean
  id: string = 'upload-input-file'
  client = null
  localKeySet: OssKeySet = new OssKeySet()

  @Watch('keySet', { deep: true })
  watchKeySetChange(val: OssKeySet, old: OssKeySet) {
    this.localKeySet = val
    this.preInit()
  }

  created() {
    this.id = 'upload-input-file' + Math.random()
    this.LoadJS('js_aliyun_oss', 'https://gosspublic.alicdn.com/aliyun-oss-sdk-4.10.0.min.js')
    this.preInit()
  }

  mounted() {
    const windowVueOssUploader = (window as any)._VueOssUploader
    if (this.keySet && this.keySet.key) {
      this.localKeySet = this.keySet
    } else if (windowVueOssUploader) {
      this.localKeySet = Object.assign({}, new OssKeySet(), {
        key: windowVueOssUploader.key,
        region: windowVueOssUploader.region,
        secret: windowVueOssUploader.secret,
        bucket: windowVueOssUploader.bucket
      })
    } else {
      this.debug && console.error('oss配置信息缺失')
      this.$emit('error', {msg: 'oss配置信息缺失'})
    }
  }

  preInit() {
    let timer: any = setInterval(() => {
      if ((window as any).OSS) {
        this.init()
        clearInterval(timer)
        timer = null
        this.debug && window.console.log('阿里云oss初始化完成')
      } else {
        this.debug && window.console.log('阿里云oss初始化中...')
      }
    }, 500)
  }

  // oss 初始化
  init() {
    if (!this.localKeySet.bucket) {
      this.$emit('error', {msg: '请设置bucket'})
      return
    }
    if (!this.localKeySet.secret) {
      this.$emit('error', {msg: '请设置secret'})
      return
    }
    if (!this.localKeySet.key) {
      this.$emit('error', {msg: '请设置key'})
      return
    }
    if (!this.localKeySet.region) {
      this.$emit('error', {msg: '请设置区域'})
      return
    }
    let set = {
      endpoint: 'https://oss-cn-' + this.localKeySet.region + '.aliyuncs.com',
      accessKeyId: this.localKeySet.key,
      accessKeySecret: this.localKeySet.secret,
      bucket: this.localKeySet.bucket,
      secure: false
    }
    // 是否开启https
    if (this.localKeySet.https) {
      // https时需要设置为true
      set.secure = true
    }
    // @ts-ignore
    this.client = new OSS.Wrapper(set)
  }

  LoadJS(sId: string, fileUrl: string, callback?: any) {
    let dom = document.querySelector(sId)
    if (!dom) {
      let script = document.createElement('script')
      script.src = fileUrl
      if (callback) {
        script.onload = callback
      }
      script.id = sId
      document.body.appendChild(script)
    }
  }

  ossUpload(ossPath: string, file: any) {
    if (!this.client) {
      this.$emit('error', {msg: 'oss初始化未完成'})
      return
    }
    this.debug && console.log('上传文件：', file.name + ' => ' + ossPath)
    return new Promise((resolve, reject) => {
      // @ts-ignore
      this.client.multipartUpload(ossPath, file).then((result: any) => {
        this.debug && console.log('oss result', result)
        let url = result.url
        // 处理错误的情况
        if (!url) {
          url = result.res.requestUrls[0].split('?')[0]
        }
        // console.log(ossPath, url, '上传成功')
        resolve({
          ossPath,
          ossUrl: url
        })
      }).catch((err: any) => {
        this.debug && console.log(err)
        reject(err)
      })
    })
  }
}

class OssKeySet {
  key: string = ''
  region: string = ''
  secret: string = ''
  bucket: string = ''
  https: boolean = true
}