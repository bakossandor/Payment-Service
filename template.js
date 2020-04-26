const fs = require('fs');
const path = require('path');

const PROJECT_ID = process.env.PROJECT_ID
const SHA = process.env.SHORT_SHA
let NAME_PART = `test`

const manifest = () => 
`apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${NAME_PART}-payment
spec:
  selector:
    matchLabels:
      app: ${NAME_PART}-payment
  replicas: 1
  template:
    metadata:
      labels:
        app: ${NAME_PART}-payment
    spec:
      containers:
      - image: eu.gcr.io/${PROJECT_ID}/payment:${SHA}
        imagePullPolicy: Always
        name: ${NAME_PART}-payment
        ports:
        - containerPort: 5500
---
apiVersion: v1
kind: Service
metadata:
  name: ${NAME_PART}-payment
spec:
  ports:
  - port: 80
    targetPort: 5500
    protocol: TCP
  selector:
    app: ${NAME_PART}-payment
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ${NAME_PART}-payment
  annotations:
    kubernetes.io/ingress.class: "nginx"    
    cert-manager.io/issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - ${NAME_PART}.payment.itek-final-project.company
    secretName: payment-secret-${NAME_PART}
  rules:
  - host: ${NAME_PART}.payment.itek-final-project.company
    http:
      paths:
      - path: /
        backend:
          serviceName: ${NAME_PART}-payment
          servicePort: 80`

function createFiles(name, sha) {
  if (!fs.existsSync(path.join(__dirname, './manifests'))) {
    fs.mkdirSync(path.join(__dirname, './manifests/'))
  }
  fs.writeFileSync(path.join(__dirname, `./manifests/${name}-${sha}-payment-manifest.yaml`), manifest());
}

createFiles(NAME_PART, SHA)
NAME_PART = 'prod'
createFiles(NAME_PART, SHA)