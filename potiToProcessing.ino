// Arduino: Potentiometer on A0 -> send 0..1023 over Serial
const int POT_PIN = 32;
unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int val = analogRead(POT_PIN);  // 0..1023
  // send ~20 times per second
  if (millis() - lastSend > 50) {
    Serial.println(val);
    lastSend = millis();
  }
}

