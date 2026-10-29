// 예시 자료(sample-data.js)의 값으로 화면 글자를 채웁니다.
const snapshot = window.SAMPLE_SNAPSHOT;

const factoryCompleted = snapshot.sites.factory.completed;
const factoryTarget = snapshot.sites.factory.target;
const factoryQuantity = document.querySelectorAll("#factory-quantity span");
factoryQuantity[0].textContent = "생산 " + factoryCompleted + "개";
factoryQuantity[1].textContent = "· 목표 " + factoryTarget + "개";

const warehouseCompleted = snapshot.sites.warehouse.completed;
const warehouseTarget = snapshot.sites.warehouse.target;
const warehouseQuantity = document.querySelectorAll("#warehouse-quantity span");
warehouseQuantity[0].textContent = "출고 " + warehouseCompleted + "개";
warehouseQuantity[1].textContent = "· 목표 " + warehouseTarget + "개";
