# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## how to run this code 
go to 
`
cd dataVisulaziation/ECGapp
`

 and run 
`
 npm install 
 `
 in order to install the pakages.
 After finishing instulation you may run 

`npm run dev` 

open:
`http://localhost:5173/` 

go to ECG chart and you could explore the tool. 

## Project Overview

This project is a web-based ECG visualization tool built using the following technologies:

- **React** — functional components with hooks
- **ECharts** — powerful and interactive charting library
- **Tailwind CSS** — utility-first styling
- **Vite** — fast bundling and modern development experience

###  Project Structure

- **Pages**
  - Located in the `pages` directory, such as `EcgChart.jsx`, which defines main route views.

- **Components**
  - `GraphWithEcharts.jsx`: Core component responsible for rendering the ECG waveform, annotations, zoom logic, and data interaction.
  - `SidebarDrawer.jsx`: Drawer for filtering beat types (N, V, A, S) and batch updating labels.

###  Features

- **Interactive ECG Chart**  
  Visualizes the ECG waveform with annotated beats and smooth line transitions.

-  **Zoom & Highlight**  
  Users can zoom into a section of the graph, and the tool calculates:
  - Time range (start and end in ms)
  - Number of beats in range
  - Estimated heart rate (HR) in bpm

- **Label Editing**  
  Click any beat to view and change its label (N, V, A, S).

-  **Sidebar Filters**  
  Filter visible labels and apply batch updates for selected beats.

###  Bonus Features Implemented

-  **Highlight Area & Measure**  
  Zooming into a range dynamically updates a summary panel showing time span, beat count, and estimated HR.

-  **Lorenz (Poincaré) Plot**  
  Not implemented due to time constraints. Can be added using RR intervals from beat data.

---

### 🔍 Additional Notes

- Core logic is found in `GraphWithEcharts.jsx`, using idiomatic React patterns.
- Interaction is handled through `echarts-for-react` and native ECharts event hooks (`click`, `dataZoom`).
- Visual markers and highlight regions are created

---

### Acknowledgment

Some parts of the code used in this assignment were generated with the assistance of **GPT-4o** by OpenAI to accelerate development and problem-solving.
