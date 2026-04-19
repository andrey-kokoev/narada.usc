export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bdata\b.*\bpipeline\b|\betl\b|\belt\b|\bingestion\b|\bdata warehouse\b|\bstream process|\banalytics pipeline/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Source systems and their data formats, APIs, and access patterns", governing: true },
      { layer: "ontology", description: "Ingestion mode (batch, streaming, micro-batch, hybrid)", governing: true },
      { layer: "dynamics", description: "Schema and contracts (explicit schema, schema-on-read, evolution policy)", governing: true },
      { layer: "normativity", description: "Validation rules and data quality requirements", governing: true },
      { layer: "dynamics", description: "Transformation semantics (mapping, aggregation, enrichment, denormalization)", governing: true },
      { layer: "environment", description: "Data lineage and traceability requirements", governing: true },
      { layer: "dynamics", description: "Backfills and reprocessing strategy", governing: true },
      { layer: "normativity", description: "Freshness/SLA requirements for different data products", governing: true },
      { layer: "environment", description: "Monitoring and alerting for pipeline health", governing: true },
      { layer: "normativity", description: "Data retention and privacy requirements", governing: true },
    ],
    questions: [
      { question: "What are the source systems and their data formats?", authority: "principal", blocking: true },
      { question: "What ingestion mode is required?", authority: "principal", options: ["batch", "streaming", "micro-batch", "hybrid"], blocking: true },
      { question: "What schema and evolution policy is required?", authority: "semantic", options: ["explicit-schema", "schema-on-read", "hybrid"], blocking: true },
      { question: "What data quality and validation rules apply?", authority: "principal", blocking: false },
      { question: "What freshness/SLA is required for each data product?", authority: "principal", blocking: false },
      { question: "What are the retention and privacy requirements?", authority: "principal", blocking: false },
      { question: "How should backfills and reprocessing be handled?", authority: "semantic", options: ["full-rewrite", "incremental", "versioned"], blocking: false },
    ],
    assumptions: [
      { assumption: "Source systems are available and documented", confidence: "low", reversible: true },
      { assumption: "Standard monitoring and alerting are sufficient for MVP", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Pipeline construction will separate ingestion, validation, transformation, and serving into distinct stages.", rationale: "Separation enables independent scaling, retry, and evolution of each stage.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Inventory source systems and data contracts", authority_locus: "semantic", transformation: "List all sources, their formats, schemas, access methods, and owners.", evidence_requirement: "Source inventory with data contracts exists.", review_predicate: "Every source has a documented schema and access method." },
      { id: "T4", title: "Define ingestion mode and schema policy", authority_locus: "principal", transformation: "Choose batch vs streaming and schema evolution policy.", evidence_requirement: "Ingestion and schema policy is documented.", review_predicate: "Policy covers schema changes without breaking downstream consumers." },
      { id: "T5", title: "Define data quality and validation rules", authority_locus: "principal", transformation: "Document validation rules, quality thresholds, and failure handling.", evidence_requirement: "Quality rules and thresholds are documented.", review_predicate: "Every data product has defined quality criteria." },
    ],
    residuals: [
      { residual_id: "res-sources", class: "unresolved_principal_decision", description: "Source systems and data contracts are not defined.", blocking: true },
      { residual_id: "res-ingestion", class: "unresolved_principal_decision", description: "Ingestion mode is not selected.", blocking: true },
      { residual_id: "res-schema", class: "missing_policy", description: "Schema and evolution policy is undefined.", blocking: false },
    ],
  };
}
