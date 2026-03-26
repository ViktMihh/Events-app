<template lang="pug">
.flex.justify-evenly
  div
    .flex.items-center.mb-2
      country-flag.m-0(
        country="es"
        size="normal"
      )
      div.py-0 Español
    .border-solid.border-gray-200.rounded-lg(
      class="border-[0.5px] w-[202px]"
    )
      img.cursor-pointer(
        :src="checkinData.spanishCheckinQr"
        @click="downloadSVG(checkinData.spanishCheckinQr, 'español', 'checkin')"
      )
    a-button.my-4(
      @click="downloadSVG(checkinData.spanishCheckinQr, 'español', 'checkin')"
      type="default"
      size="middle"
      class="sm:block sm:w-full"
    )
      .flex
        download-outlined.pt-1.pr-2
        div Download SVG
    .border-solid.bg-white.border-gray-200.rounded.p-2.break-words(
      class="border-[0.5px] max-w-[202px]"
    )
      a(
        :href="checkinData.checkinURL"
        target="_blank"
      ) {{ checkinData.checkinURL }}
  div
    .flex.items-center.mb-2
      country-flag.m-0(
        country="gb"
        size="normal"
      )
      div.py-0 Inglés
    .border-solid.border-gray-200.rounded-lg(
      class="border-[0.5px]"
    )
      img.cursor-pointer(
        :src="checkinData.englishCheckinQr"
        @click="downloadSVG(checkinData.englishCheckinQr, 'inglés', 'checkin')"
      )
    a-button.my-4(
      @click="downloadSVG(checkinData.englishCheckinQr, 'inglés', 'checkin')"
      type="default"
      size="middle"
      class="sm:block sm:w-full"
    )
      .flex
        download-outlined.pt-1.pr-2
        div Download SVG
    .border-solid.bg-white.border-gray-200.rounded.p-2.break-words(
      class="border-[0.5px] max-w-[202px]"
    )
      a(
        :href="checkinData.englishCheckinURL"
        target="_blank"
      ) {{ checkinData.englishCheckinURL }}
</template>

<script>
import { DownloadOutlined } from '@ant-design/icons-vue';
import useQrCode from '@/composables/useQrCode';
import { reactive, onBeforeMount } from 'vue';
import { generateUrl } from '@/util';
import CountryFlag from 'vue-country-flag-next';

export default {
  components: {
    CountryFlag,
    DownloadOutlined,
  },
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const {
      generateQrCode,
      downloadSVG,
    } = useQrCode();

    const checkinData = reactive({
      checkinURL: generateUrl('checkin', 'es', props.event.id),
      englishCheckinURL: generateUrl('checkin', 'en', props.event.id),
      spanishCheckinQr: null,
      englishCheckinQr: null,
    });

    onBeforeMount(async () => {
      checkinData.spanishCheckinQr = await generateQrCode(checkinData.checkinURL);
      checkinData.englishCheckinQr = await generateQrCode(checkinData.englishCheckinURL);
    });

    return {
      checkinData,
      downloadSVG,
    };
  },
};
</script>
