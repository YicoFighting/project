<template>
  <xl-modal-prevention
    :width="406"
    :height="636"
    title-c="预警列表"
    title-e="Alert list"
  >
    <template #main>
      <div class="main">
        <div ref="content" class="content">
          <div v-for="item in warningList" :key="item.id" class="content-box">
            <div class="title">
              <img
                v-if="item.statusName == '待处置'"
                src="@/assets/icons/other/list_fence_icon.svg"
                alt=""
              />
              <img v-else src="@/assets/icons/other/list_icon.svg" alt="" />
              <span
                v-if="item.statusName == '待处置'"
                style="color: #d2ff77; white-space: nowrap"
              >
                {{ item.typeName }}
              </span>
              <span v-else style="color: #ffffff; white-space: nowrap">
                {{ item.typeName }}
              </span>
              <span>{{ item.datetime }}</span>
            </div>

            <div class="body">
              <p style="white-space: nowrap">{{ item.alarmName }}</p>
              <div class="body-box">
                <img :src="item.img" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </xl-modal-prevention>
</template>

<script setup>
import { XlModalPrevention } from "@/components";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSocketInstance } from "@/stores/socket";

const store = useSocketInstance();
const { warningList } = storeToRefs(store);

// 获取数据
const getList = () => {
  let res = {
    code: 0,
    data: {
      current: "1",
      hitCount: false,
      orders: [],
      pages: "7689",
      records: [
        {
          id: "1",
          statusName: "待处置",
          typeName: "到离校预警",
          datetime: "2023-10-30 16:45:05",
          alarmName: "异常晚离校",
          img: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/m3/wallhaven-m3w6pk.png?w=2560&h=1440&fmt=webp",
        },
        {
          id: "2",
          statusName: "误报",
          typeName: "到离校预警",
          datetime: "2023-10-29 16:38:35",
          alarmName: "异常晚离校",
          img: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/9d/wallhaven-9d861k.jpg?w=2560&h=1440&fmt=webp",
        },
        {
          id: "3",
          statusName: "待处置",
          typeName: "到离校预警",
          datetime: "2023-10-28 16:38:34",
          alarmName: "异常晚离校",
          img: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/jx/wallhaven-jx16pm.jpg?w=2560&h=1440&fmt=webp",
        },
        {
          id: "4",
          statusName: "待处置",
          typeName: "到离校预警",
          datetime: "2023-10-27 16:37:30",
          alarmName: "异常晚离校",
          img: "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/zy/wallhaven-zydwwj.jpg?w=2560&h=1440&fmt=webp",
        },
      ],
      searchCount: true,
      size: "4",
      total: "30756",
    },
    msg: "ok",
  };
  warningList.value = res.data.records;
};
onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  position: relative;
  .content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .content-box {
      .title {
        display: flex;
        padding: 15px;
        img {
          width: 22px;
          height: 22px;
        }
        :nth-child(2) {
          width: 108px;
          height: 25px;
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #d2ff77;
          line-height: 25px;
          margin: 0 87px 0 16px;
        }
        :nth-child(3) {
          width: 139px;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 20px;
        }
      }
      .body {
        border-left: 2px solid rgba(255, 255, 255, 0.3);
        height: 105px;
        margin-left: 26px;
        padding-left: 25px;
        > p {
          margin: 0;
          width: 64px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 22px;
          margin-bottom: 8px;
        }
        .body-box {
          img {
            margin-right: 10px;
          }
          img,
          video {
            width: 92px;
            height: 55px;
          }
          .play {
            width: 19px;
            height: 19px;
            background: rgba(14, 23, 52, 0.65);
            border: 0.5px solid #ffffff;
            position: absolute;
            border-radius: 50%;
            left: 47%;
            top: 18%;
            cursor: pointer;
            > p {
              width: 8px;
              height: 8px;
              position: absolute;
              background: #fff;
              left: 37%;
              top: -53%;
              clip-path: polygon(0 8px, 0 0, 7px 4px);
            }
          }
        }
      }
    }
  }
}
/*滚动条的宽度*/
::-webkit-scrollbar {
  width: 4px;
  height: 73px;
}

/*滚动条里面小方块*/
::-webkit-scrollbar-thumb {
  background: #5797ff;
}
</style>
