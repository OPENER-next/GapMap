import { lineData } from "$lib/data/lines";

export class LineStore {
	lines = lineData;

	#selectedLineId?: string = $state();

	get selectedLineId() {
		return this.#selectedLineId;
	}

	set selectedLineId(value: string | undefined) {
		this.#selectedLineId = value;
		const line = value !== undefined ? lineData.get(value) : undefined;
		// unset selected stop if it is not part of the new line
		if (this.selectedPlatformId && !line?.stops.some(p => p.id === this.selectedPlatformId)) {
			this.selectedPlatformId = undefined;
		}
	}

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


	get isLineSelected() {
		return this.#selectedLineId !== undefined;
	}

	get isPlatformSelected() {
		return this.selectedPlatformId !== undefined;
	}

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
