<template>
  <!-- <div v-confetti="{ particleCount: 250, force: 0.5, duration: 5000, destroyAfterDone: true, stageWidth: 4000, stageHeight: 1000 }" /> -->

  <div class="bg-[#2B2B2B] w-full h-12 flex justify-center items-center font-medium text-white text-lg gap-3 mb-5">
    <i class="pi pi-discord text-[#5662F6] !text-2xl"></i>
    <span>Beta aberta! Entre no nosso discord</span>
  </div>

  <div class="options">
    <Slider id="brush_size" v-model="BRUSH_SIZE" :min="1" :max="100" class="w-56" />
    <ColorPicker v-model="BRUSH_COLOR" inline />
    <Button @click="gerarImagem" fluid severity="info" label="gera imagem" />
    <Button @click="baixarImagem" fluid severity="help" label="baixar imagem" />
  </div>

  <div>
    <div class="bg-red-500 flex justify-center" v-if="player?.isHost == true">
      <span>HOST</span>
    </div>
    <div class="flex justify-center">
      <InputGroup class="mt-2.5 max-w-72">
        <InputText v-model="newNick" placeholder="novo nick" />
        <Button @click="updateNick" icon="pi pi-save" severity="info" />
      </InputGroup>
    </div>
    <br />
    <ul>
      <li v-for="(player, index) in players" :key="index">{{ player.nick }}</li>
    </ul>
  </div>

  <div class="grid grid-cols-[550px_200px] justify-center items-center mb-5 gap-5">
    <div class="flex justify-end">
      <canvas @mousedown="startDraw" @mouseup="endDraw" @mousemove="draw" id="draw_board" width="800" height="600" style="border: 1px solid #000;"></canvas>
    </div>
    <div class="p-5 border border-black rounded-md max-w-60 h-full">
      <div class="flex flex-wrap gap-5 justify-center">
        <Button :class="{ '!bg-green-800 !border !border-green-800': TOOL_SELECTED == TOOL.value }" v-for="(TOOL, index) in TOOLS" :key="index" :icon="TOOL.icon" @click="selectTool(TOOL.value)" />
      </div>
    </div>
  </div>

  <div id="image-container"></div>
</template>

<script setup lang="ts">
import { vConfetti } from '@neoconfetti/vue';
import { onMounted, ref } from 'vue';
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import socket from '../../service/socket';
import { ColorPicker, InputGroup, Slider } from 'primevue';

interface Player {
  id: string,
  nick: string,
  isHost: boolean,
  uuid: string
}

const message = ref<string>("");
const drawing = ref(false);
const canvas = ref<HTMLCanvasElement | null>();
const ctx = ref<CanvasRenderingContext2D | null>();
const BRUSH_SIZE = ref(30);
const BRUSH_COLOR = ref('000000');
const players = ref<Player[]>([]);
const player = ref<Player>();
const newNick = ref('');
const uuid = ref(crypto.randomUUID());
const TOOL_SELECTED = ref<string>('PINCEL');
const TOOLS = ref([
  { icon: 'pi pi-pencil', value: 'PINCEL' },
  { icon: 'pi pi-eraser', value: 'ERASER' },
  { icon: 'pi pi-microsoft', value: 'SQUARE' },
  { icon: 'pi pi-circle-fill', value: 'CIRCLE' }
]);
const start = ref<{ x: number, y: number } | null>(null);
const rects = ref<{ x: number, y: number, width: number, height: number }[]>([]);

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) * canvas.width / rect.width,
    y: (evt.clientY - rect.top) * canvas.height / rect.height,
  };
}

function startDraw(evt: MouseEvent) {
  if (canvas.value) {
    drawing.value = true;
    if (TOOL_SELECTED.value === 'SQUARE') {
      start.value = getMousePos(canvas.value, evt);
    }
  }
}

function endDraw(event: MouseEvent) {
  if (!canvas.value || !ctx.value) return;
  drawing.value = false;

  if (TOOL_SELECTED.value === 'SQUARE' && start.value) {
    const end = getMousePos(canvas.value, event);
    // const rect = {
    //   x: start.value.x,
    //   y: start.value.y,
    //   width: end.x - start.value.x,
    //   height: end.y - start.value.y
    // };
    // rects.value.push(rect);
    // drawRect(); // Redesenha todos os retângulos
    start.value = null;
  }

  ctx.value.beginPath(); // evita riscos extras com pincel
}

// function drawRect() {
//   if (!canvas.value || !ctx.value) return;

//   ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

//   rects.value.forEach(rect => {
//     ctx.value.beginPath();
//     ctx.value.fillStyle = `#${BRUSH_COLOR.value}`;
//     ctx.value.fillRect(rect.x, rect.y, rect.width, rect.height);
//     ctx.value.closePath();
//   });
// }

function selectTool(tool_selected: string) {
  TOOL_SELECTED.value = tool_selected;
}

function draw(event: MouseEvent) {
  if (!canvas.value || !ctx.value || !drawing.value) return;
  const { x, y } = getMousePos(canvas.value, event);

  switch (TOOL_SELECTED.value) {
    case 'PINCEL':
      ctx.value.lineWidth = BRUSH_SIZE.value;
      ctx.value.lineCap = 'round';
      ctx.value.strokeStyle = `#${BRUSH_COLOR.value}`;
      ctx.value.lineTo(x, y);
      ctx.value.stroke();
      ctx.value.beginPath();
      ctx.value.moveTo(x, y);
      break;

    case 'ERASER':
      ctx.value.save();
      ctx.value.globalCompositeOperation = 'destination-out';
      ctx.value.lineWidth = BRUSH_SIZE.value;
      ctx.value.lineCap = 'round';
      ctx.value.strokeStyle = 'rgba(0,0,0,1)';
      ctx.value.lineTo(x, y);
      ctx.value.stroke();
      ctx.value.beginPath();
      ctx.value.moveTo(x, y);
      ctx.value.restore();
      break;

    case 'SQUARE':
      if (start.value) {
        // drawRect(); // redesenha todos os retângulos salvos
        ctx.value.beginPath();
        // ctx.value.fillStyle = `#${BRUSH_COLOR.value}`;
        // ctx.value.fillRect(start.value.x, start.value.y, x - start.value.x, y - start.value.y);
        ctx.value.lineWidth = 1;
        ctx.value.strokeStyle = `#${BRUSH_COLOR.value}`;

        ctx.value.strokeRect(start.value.x, start.value.y, x - start.value.x, y - start.value.y);
        ctx.value.closePath();
      }
      break;
  }
}

function gerarImagem() {
  if (!canvas.value) return;
  canvas.value.toBlob((blob) => {
    if (blob) {
      blob.arrayBuffer().then((buffer) => {
        socket.emit('message', buffer);
      });
    }
  }, 'image/png', 0.8);
}

function baixarImagem() {
  if (!canvas.value) return;
  const link = document.createElement('a');
  link.href = canvas.value.toDataURL('image/png');
  link.download = 'meu-desenho.png';
  link.click();
}

function updateNick() {
  if (newNick.value.trim().length > 0) {
    socket.emit('change-nick', newNick.value);
  }
}

onMounted(() => {
  canvas.value = document.getElementById('draw_board') as HTMLCanvasElement;
  ctx.value = canvas.value.getContext('2d');

  socket.emit('join', uuid.value);

  socket.on('message', (data) => {
    const blob = new Blob([data], { type: 'image/png' });
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.alt = 'Imagem recebida';
    img.className = 'imagem-recebida';

    const container = document.getElementById('image-container');
    if (container) {
      container.appendChild(img);
    }

    img.onload = () => URL.revokeObjectURL(img.src);
  });

  socket.on('updated-players', (onlinePlayers: Player[]) => {
    players.value = onlinePlayers;
    player.value = onlinePlayers.find(p => p.uuid === uuid.value);
  });
});
</script>

<style scoped>
.options {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

#brush_size {
  width: 15rem;
}
</style>
