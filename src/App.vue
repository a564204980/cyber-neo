<script>
import { loadCustomFonts } from '@/utils/font';


export default {
  onLaunch: function () {
    console.log('App Launch')
    loadCustomFonts();
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@use "@/static/css/global.scss" as *;

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --primary-color: #3b82f6;
  --primary-rgb: 59, 130, 246;
  background-color: #000000;
  color: #ffffff;
}

/* Material Symbols 图标样式 */
.material-icons {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  /* 默认大小 */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}
</style>
