import { lineData } from "$lib/data/lines";

export class LineStore {
	lines = lineData;

	selectedLineId?: string = $state();
	readonly selectedLine = $derived.by(() => {
		if (this.selectedLineId !== undefined) {
			return lineData.get(this.selectedLineId);
		}
	});

	selectedPlatformId?: string = $state();
	readonly selectedPlatform = $derived.by(() => {
		if (this.selectedPlatformId !== undefined) {
			return this.selectedLine?.stops.find(p => p.id === this.selectedPlatformId);
		}
	});

	nextPlatform() {
		if (this.selectedLine) {
			const currentIndex = this.selectedLine.stops.findIndex(p => p.id === this.selectedPlatformId);
			if (currentIndex >= 0) {
				const nextIndex = currentIndex + 1;
				if (nextIndex < this.selectedLine.stops.length) {
					this.selectedPlatformId = this.selectedLine.stops[nextIndex].id;
				}
			}
		}
	}

	previousPlatform() {
		if (this.selectedLine) {
			const currentIndex = this.selectedLine.stops.findIndex(p => p.id === this.selectedPlatformId);
			const previousIndex = currentIndex - 1;
			if (previousIndex >= 0) {
				this.selectedPlatformId = this.selectedLine.stops[previousIndex].id;
			}
		}
	}
}
