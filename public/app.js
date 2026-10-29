// 예시 자료(sample-data.js)의 값으로 화면 글자를 채웁니다.
const snapshot = window.SAMPLE_SNAPSHOT;
const sites = [
  { id: "factory", noun: "생산", label: "텀블공장" },
  { id: "warehouse", noun: "출고", label: "물류창고" }
];
// 0 이상의 안전한 정수만 수량으로 씁니다. 틀린 값을 0으로 바꾸지 않습니다.
const integer = (value) => Number.isSafeInteger(value) && value >= 0;
const numberText = (value) => integer(value) ? value.toLocaleString("ko-KR") + "개" : "확인 불가";

for (const { id, noun, label } of sites) {
  const completed = snapshot.sites[id].completed;
  const target = snapshot.sites[id].target;
  const quantity = document.querySelectorAll("#" + id + "-quantity span");
  quantity[0].textContent = noun + " " + numberText(completed);
  quantity[1].textContent = "· 목표 " + numberText(target);

  const progressText = document.querySelector("#" + id + "-progress-text");
  const bar = document.querySelector("#" + id + "-progress");
  const exceeded = document.querySelector("#" + id + "-exceeded");
  if (!integer(completed) || !integer(target) || target === 0) {
    progressText.textContent = "계획 대비 목표를 확인해 주세요";
    bar.hidden = true;
    exceeded.hidden = true;
    continue;
  }
  // 달성률 = 실적 ÷ 목표 × 100. 글자는 소수점 한 자리, 막대는 계산값 그대로(100을 넘지 않게) 씁니다.
  const rate = completed / target * 100;
  const rateText = rate.toFixed(1) + "%";
  progressText.textContent = "계획 대비 " + rateText;
  bar.hidden = false;
  bar.value = Math.min(100, rate);
  bar.setAttribute("aria-label", label + " 목표 달성률 " + rateText);
  exceeded.hidden = !(completed > target);
}
