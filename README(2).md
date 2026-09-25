# JALRAKSHA

### AI & Earth Observation Based Post-Flood WASH Decision Support System

> **From Earth Observation to Community-Level Action**

JALRAKSHA is a humanitarian decision-support platform designed to help identify communities affected by floods, assess disruption to **Water, Sanitation and Hygiene (WASH)** infrastructure, evaluate accessibility to essential services, and support emergency intervention prioritization.

The platform combines **Earth Observation (EO), GIS, population and infrastructure data, road-network analysis, field reports, and AI-assisted information extraction** into a single disaster-response interface.

---

## Problem Statement

JALRAKSHA is developed for **SPARK 4.0 EO Hackathon 2026 – Problem Statement 5: “After the Flood — Mapping WASH Disruptions and Community Needs.”**

The problem focuses on identifying communities whose access to water, sanitation and healthcare has been disrupted after a flood, estimating population exposure, assessing access to alternative facilities, and helping responders prioritize emergency intervention.

---

## What JALRAKSHA Does

The platform follows a simple decision-support workflow:

**Flood Detection → Community Impact → WASH Assessment → Accessibility Analysis → Priority Scoring → Relief Planning**

Instead of only showing where flooding occurred, JALRAKSHA attempts to answer:

- Which communities are affected?
- How severely are their WASH facilities disrupted?
- How many people are exposed?
- Can residents reach alternative water sources and health facilities?
- Which roads or routes create accessibility problems?
- Which communities require the most urgent attention?
- Why has a community received its priority level?

---

## Key Features

### 1. Interactive Disaster Map

A Leaflet-based GIS interface provides multiple map views and operational layers.

**Base maps**
- Dark Matter
- OpenStreetMap
- Satellite imagery

**Operational layers**
- Sentinel-1 SAR flood inundation
- Monitored settlements and communities
- Drinking water points
- Sanitation facilities
- Health facilities
- Road networks and washouts
- Crowd-sourced incident reports

Additional map functions include district filtering, settlement quick navigation, map focus presets, diagnostic popups and route comparisons.

---

### 2. Emergency Dashboard

The dashboard provides high-level operational indicators such as:

- Total exposed population
- Disrupted or potentially contaminated drinking water sources
- Flooded sanitation facilities
- Health facilities with impaired road access
- High and Critical priority settlements
- Active basin and flood information

A critical-priority triage board highlights communities requiring closer attention.

---

### 3. Community Vulnerability Analysis

Each monitored settlement can have a detailed diagnostic profile containing:

- District, municipality and ward
- Population
- Average flood depth
- Standing-water duration
- Operational and affected water points
- Sanitation degradation and contamination-risk indicators
- Nearest operational water source
- Nearest health facility
- Accessibility conditions
- Vulnerability characteristics
- Explainable priority-score breakdown

The system can also present potential humanitarian response actions such as water purification support, water tanker deployment, emergency sanitation measures and medical support.

---

### 4. Road Detour & Accessibility Analysis

JALRAKSHA goes beyond straight-line distance.

It compares:

**Straight-line distance vs. actual accessible road distance**

The analysis can account for:

- Flooded roads
- Washed-out culverts
- Embankment damage
- Submerged causeways
- Debris blockages
- Alternative detour routes

A detour penalty can show how road disruption increases travel distance and affects access to water and healthcare.

---

### 5. WASH Emergency Priority Index (WEPI)

JALRAKSHA uses a multi-criteria decision-support model called the **WASH Emergency Priority Index (WEPI)**.

The specification defines:

```text
WEPI =
(W1 × Flood Depth) +
(W2 × Water Disruption) +
(W3 × Sanitation Disruption) +
(W4 × Detour Penalty) +
(W5 × Vulnerable Demographics)
```

The five weights can be adjusted interactively, with the system recalculating community priorities.

### Priority Categories

| Category | Score | Intended response |
|---|---:|---|
| CRITICAL | ≥ 75 | Immediate 0–24 hour intervention |
| HIGH | 50–74 | Urgent 24–48 hour response |
| MODERATE | 25–49 | 48–72 hour monitoring and staging |
| LOW | < 25 | Routine support |

**Note:** WEPI is a prototype decision-support model described in this project specification. It is not presented as an officially validated humanitarian standard.

---

### 6. AI-Assisted Field Report Extraction

JALRAKSHA includes an AI-assisted workflow for processing unstructured field communications.

The system can extract information such as:

- Affected community or ward
- Estimated flood depth
- Drinking-water disruption
- Sanitation hazards
- Medical emergencies
- Disease-outbreak indicators
- Suggested priority classification
- Confidence score

The specification includes a playground for testing realistic field messages and a function to add extracted incidents to the operational map.

---

### 7. Citizen & First-Responder Reporting

Users can submit incident reports including:

- Submerged water point
- Contaminated latrine
- Road washout
- Disease outbreak
- Stranded population

Reports can contain:

- Location
- Severity
- Description
- Photo attachment
- Timestamp

Reports move through an **Unverified → Verified** workflow, allowing responders to validate incidents before they become verified operational information.

---

### 8. Earth Observation Module

The EO module provides a before-and-after satellite comparison workflow.

The current specification focuses on:

**Pre-flood optical baseline → Post-flood Sentinel-1 SAR → Flood extent detection → Infrastructure and community impact analysis**

The Sentinel-1 workflow includes:

- C-band SAR
- IW mode
- GRD products
- VV and VH polarization
- Otsu-based automatic water thresholding
- Day/night and cloud-penetrating radar capability

The project also documents possible processing routes through Copernicus Data Space, Google Earth Engine and OpenStreetMap data services.

---

### 9. Multi-Source EO Data Catalogue

The platform includes a catalogue of potential data sources covering:

1. Satellite SAR
2. Optical multispectral imagery
3. Elevation and DEM
4. Precipitation and weather
5. Soil moisture
6. River gauges and hydrology
7. Population and exposure
8. Infrastructure and basemaps
9. Land use and land cover
10. Global flood-hazard models

Example datasets include Sentinel-1, Sentinel-2, Landsat, NISAR, ALOS-2 PALSAR, Copernicus DEM, SRTM, GPM IMERG, ERA5, WorldPop, GHSL, OpenStreetMap and global flood-hazard datasets.

---

## Supported Disaster Zones

The prototype specification includes pre-calibrated operational zones for:

- Koshi River Basin — Nepal / India
- Brahmaputra Valley — Assam, India
- Lower Indus Basin — Sindh, Pakistan
- Guaíba River Basin — Rio Grande do Sul, Brazil
- Turia River Catchment — Valencia, Spain
- Wadi Derna Basin — Libya

The system also supports a custom Area of Interest concept using:

- Latitude
- Longitude
- Basin name
- Impact radius

The zone switcher is designed to recenter the map and recalculate operational metrics for the selected area.

---

## Scientific Methodology

The platform specification documents several supporting analytical components:

- Water Disruption Index (WDI)
- Sanitation Contamination Risk Index (SCRI)
- Road Detour Penalty Ratio (RDPR)
- Vulnerable Demographics Weighting (VDW)
- Network routing and Dijkstra-based graph traversal
- Flood and infrastructure impact analysis

The objective is to make the priority process more explainable rather than producing an unexplained risk label.

---

## Guided Demonstration

JALRAKSHA includes a planned **15-step guided demonstration tour** for humanitarian evaluators and responders.

The demonstration moves through the complete workflow:

1. Select disaster zone
2. View flood extent
3. Examine affected communities
4. Activate WASH layers
5. Inspect water infrastructure
6. Inspect sanitation infrastructure
7. Check health facilities
8. Analyse road accessibility
9. Review field reports
10. Open a vulnerable community
11. Examine WEPI factors
12. Adjust priority weights
13. Review the priority result
14. Identify intervention requirements
15. Produce the final intervention view

---

## Data Export

The platform specification includes export support for:

- **GeoJSON** — GIS workflows such as QGIS, ArcGIS and Google Earth
- **CSV** — Priority tables and field briefings
- **JSON** — Raw telemetry and API-oriented workflows

---

## User Interface

The interface is designed as a professional disaster-response GIS rather than a conventional analytics dashboard.

Design goals include:

- Map-first workflow
- High-contrast tactical interface
- Dark and light modes
- Responsive layout
- Desktop, laptop and tablet support
- Operational telemetry presentation
- Clear priority indicators
- Minimal decorative elements

The specification uses **Plus Jakarta Sans** for UI text and **IBM Plex Mono** for telemetry-style information.

---

## Proposed Technology Ecosystem

The project specification references technologies and data platforms including:

- Leaflet GIS
- Google Earth Engine
- Copernicus Data Space Ecosystem
- OpenStreetMap / Overpass API
- Gemini AI / NLP
- GeoJSON
- CSV / JSON
- Earth Observation and geospatial processing workflows

The exact implementation of individual integrations may vary between prototype and live deployment.

---

## Offline Disaster-Response Consideration

A future extension of JALRAKSHA can follow an **offline-first architecture** for areas where flooding disrupts connectivity.

Potential offline capabilities include:

- Cached maps and community data
- Locally stored field reports
- Offline WEPI calculation
- GPS-based incident recording
- Synchronization when connectivity returns

Live satellite acquisition, cloud services and remote AI processing would still require connectivity unless equivalent local processing is implemented.

---

## Example Scenario

Consider two flood-affected villages.

**Village A**
- Severe flood exposure
- Contaminated water source
- Damaged sanitation
- Hospital far away
- Roads heavily disrupted

**Village B**
- Similar flood exposure
- Contaminated water source
- Operational nearby health facility
- Passable road connection

JALRAKSHA does not prioritize communities based only on flood extent.

It considers the combination of **WASH disruption, accessibility, flood exposure and vulnerability**. Therefore, Village A could receive a higher priority because its residents have fewer practical options for accessing essential services.

If the nearby hospital in Village B is itself flooded or inaccessible, its priority can increase accordingly.

---

## Project Value

JALRAKSHA aims to bridge the gap between **Earth Observation data and actionable humanitarian decisions**.

Traditional flood maps can show where water is present. JALRAKSHA extends this by connecting flood information with:

**People + Water + Sanitation + Healthcare + Roads + Accessibility + Field Reports**

This creates a community-level view of post-flood WASH needs and supports more transparent intervention prioritization.

---

## Project Workflow

```text
                 EARTH OBSERVATION
                        │
                        ▼
              Flood Extent Detection
                        │
                        ▼
               Community Exposure
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          WATER      SANITATION   HEALTH
             │          │          │
             └──────────┼──────────┘
                        ▼
              ROAD ACCESSIBILITY
                        │
                        ▼
              VULNERABILITY ANALYSIS
                        │
                        ▼
                    WEPI SCORE
                        │
                        ▼
              PRIORITY CLASSIFICATION
                        │
                        ▼
               RELIEF INTERVENTION
```

---

