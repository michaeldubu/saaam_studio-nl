// File: src/core/PerformanceMonitor.js
export class PerformanceMonitor {
    constructor(config) {
        this.metrics = new MetricsAggregator(config.metrics);
        this.analyzer = new PerformanceAnalyzer(config.analysis);
        this.optimizer = new AutoOptimizer(config.optimization);
    }

    async analyzePerformance() {
        const metrics = await this.metrics.collect();
        const analysis = await this.analyzer.analyze(metrics);

        if (analysis.requiresOptimization) {
            await this.optimizer.applyOptimizations(analysis.suggestions);
        }

        return analysis;
    }

    async recordUpdate(ms) {
        await this.metrics.record({ updateTime: ms });
    }
}