import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import md5 from 'blueimp-md5'
import OssUpload from 'components/file-upload/OssUpload'

@Component({
  components: {},
  mixins: [OssUpload]
})
export default class FileUpload extends Vue {
  @Prop({ type: String, default: '' }) path: string
  @Prop({ type: String, default: '' }) name: string
  @Prop({ type: Number, default: 1 }) nameMode: number
  @Prop({ type: String, default: 'img' }) fileType: string
  @Prop({ type: String, default: '' }) fileSuffix: string
  @Prop({ type: Number, default: 70 }) swidth: number
  @Prop({ type: Number, default: 70 }) sheight: number
  @Prop({ type: Number, default: '' }) ext: string // 额外信息
  imgReg =  /\.(png|jpe?g|gif|svg)(\?.*)?$/
  videoReg = /\.(mp4|avi)(\?.*)?$/
  zipReg =  /\.(zip)(\?.*)?$/
  xlsReg =  /\.(xls|xlsx)(\?.*)?$/

  get initSize() {
    let style = {
      width: this.swidth + 'px',
      height: this.sheight + 'px',
      lineHeight: this.sheight - 4 + 'px'
    }
    return style
  }

  // 获取文件后缀
  get_suffix(filename: string) {
    let pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  }

  upload(e: any) {
    this.$emit('upload')
    if (e.target.files.length === 0) {
      return
    }
    let file = e.target.files[0]
    let ossPath = ''
    if (!file) {
      alert('您未选择上传文件')
      return
    }
    // 清空input内容,以便重复触发change
    e.target.value = ''
    if (this.fileType === 'img' && !this.imgReg.test(file.name.toLowerCase())) {
      this.$message.warning('仅支持png/jpg/jpeg/gif和svg文件格式上传')
      return
    } else if (this.fileType === 'video' && !this.videoReg.test(file.name.toLowerCase())) {
      this.$message.warning('仅支持.mp4和.avi文件格式上传')
      return
    } else if (this.fileType === 'zip' && !this.zipReg.test(file.name.toLowerCase())) {
      this.$message.warning('仅支持.zip文件格式上传')
      return
    } else if (this.fileType === 'xls' && !this.xlsReg.test(file.name.toLowerCase())) {
      this.$message.warning('仅支持.xls和.xlsx文件格式上传')
      return
    }
    if (this.fileSuffix !== '' && ('.' + this.fileSuffix) !== this.get_suffix(file.name)) {
      alert('必须选择类型为的' + this.fileSuffix + '文件')
      return
    }
    if (this.nameMode === 2) {
      ossPath = this.path + file.name
    } else if (this.nameMode === 3 && this.name.trim()) {
      ossPath = this.path + this.name + this.get_suffix(file.name)
    } else {
      let token = file.name + file.lastModifiedDate + file.size + file.type
      if (this.ext) {
        ossPath = this.path + this.ext + this.get_suffix(file.name)
      } else {
        ossPath = this.path + md5(token) + this.get_suffix(file.name)
      }
    }

    (this as any).ossUpload(ossPath, file).then((res: any) => {
      this.$emit('success', res)
    }).catch((err: any) => {
      this.$emit('error', err)
    })
  }

}
