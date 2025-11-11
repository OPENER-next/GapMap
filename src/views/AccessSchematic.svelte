<script lang="ts">
  import type Vehicle from "$lib/models/vehicle";
  import { AccessAssessment, AccessSynopsis } from "$lib/models/access-assessment";
  import type Platform from "$lib/models/platform";
  import { WheelchairSpace } from "$lib/models/space";
  import AccessInfoBox from "./AccessInfoBox.svelte";
  import MaterialSymbolsAccessibleRounded from '~icons/material-symbols/accessible-rounded';
  import MaterialSymbolsQuestionMarkRounded from '~icons/material-symbols/question-mark-rounded';
  import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
  import MaterialSymbolsRemoveRounded from '~icons/material-symbols/remove-rounded';
  import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
  import MaterialSymbolsArrowWarmUpRounded from '~icons/material-symbols/arrow-warm-up-rounded';
  import MaterialSymbolsArrowCoolDownRounded from '~icons/material-symbols/arrow-cool-down-rounded';
  import WindshieldImage from '$lib/assets/windshield.svg';
  import { type Component } from "svelte";
  import type { MouseEventHandler, SVGAttributes } from "svelte/elements";
  import { fade, fly } from "svelte/transition";
  import { quartOut, sineOut } from "svelte/easing";
  import { customScale } from "$lib/transitions";

	let {
    vehicle,
    platform,
    class: className,
    onNext,
    onPrevious,
	}: {
    vehicle: Vehicle;
    platform: Platform;
    class?: string;
    onNext?: MouseEventHandler<HTMLButtonElement>;
    onPrevious?: MouseEventHandler<HTMLButtonElement>;
  } = $props();

  function selectAccessIcon(assessment: AccessSynopsis): Component<SVGAttributes<SVGSVGElement>> {
    switch (assessment) {
      case AccessSynopsis.unknown: return MaterialSymbolsQuestionMarkRounded;
      case AccessSynopsis.accessible: return MaterialSymbolsCheckRounded;
      case AccessSynopsis.aided: return MaterialSymbolsRemoveRounded;
      case AccessSynopsis.inaccessible: return MaterialSymbolsCloseRounded;
    }
  }

  function selectAccessClass(assessment: AccessSynopsis): string {
    switch (assessment) {
      case AccessSynopsis.unknown: return 'unknown';
      case AccessSynopsis.accessible: return 'good';
      case AccessSynopsis.aided: return 'limited';
      case AccessSynopsis.inaccessible: return 'bad';
    }
  }

  /**
   * Converts meters to CSS units.
   * @param value
   */
  function conv(value: number): string {
    return `${value * 25}px`;
  }
</script>


<div class="flex flex-row {className}">
  <div class="schematic-wrapper vehicle flex-1">
    {#key vehicle}
    <!--
      Ideally we would use SVG here as we are more or less abusing HTML to draw shapes. However SVG has a problem:
      In order to scale the SVG we need to define the view box, but we don't want to scale the stoke
      so we use vector-effect="non-scaling-stroke". This makes it almost impossible to calculate the view box size
      as the stroke cannot be declared as inset and instead is always on the centerline.
      Therefor a stroke going around the view box is clipped which could be avoided by setting overflow: visible,
      but then the SVG is larger than its bbox.
    -->
      <div
        class="schematic my-[3rem]"
        in:fly={{ y: '100vh', duration: 600, opacity: 1, easing: quartOut }}
        out:fade={{ duration: 300 }}
      >
        <div
          class="body"
          style="height: {conv(vehicle.length)};"
        >
          <img
            alt=""
            src={WindshieldImage}
            class="windshield"
          />
        </div>
        {#each vehicle.entrances as entrance}
          {@const entranceSide = entrance.side === 'right' ? 'right' : 'left'}
          {@const entranceStart = entrance.distanceFront}
          {@const notInUseClass = entrance.side === 'left' ? 'inactive' : ''}
          <div
            class="entrance {notInUseClass}"
            style="top: {conv(entranceStart)}; height: {conv(entrance.width)}; {entranceSide}: 0"
          ></div>
        {/each}
        {#each vehicle.spaces as space}
          {#if space instanceof WheelchairSpace}
            <div
              class="icon place"
              style="top: {conv(space.distanceFront)}"
            >
              <MaterialSymbolsAccessibleRounded/>
            </div>
          {/if}
        {/each}
      </div>
    {/key}
  </div>

  <div class="schematic flex-[2.5] my-[3rem]">
    {#each vehicle.entrances as entrance}
      {#if entrance.side === 'right'}
        {#key [entrance, platform]}
          {@const accessAssessment = AccessAssessment.evaluate(entrance, platform)}
          {@const y = entrance.distanceFront + entrance.width/2}
          {@const IconComponent = selectAccessIcon(accessAssessment.synopsis)}
          <div
            class="access-info-box {selectAccessClass(accessAssessment.synopsis)}"
            style="top:{conv(y)};"
            in:customScale|global={{ delay: 600, duration: 300, startX: 0.8, opacity: 0 }}
            out:fade|global={{ duration: 300, easing: sineOut }}
          >
            <!--TODO: Screen reader values that depicts this as first door from front-->
            <AccessInfoBox
              assessment={accessAssessment}
            />
            <div class="icon access-icon">
              <IconComponent/>
            </div>
          </div>
        {/key}
      {/if}
    {/each}
  </div>

  <div class="flex-1">
    <button
      class="swap-button h-[2rem] mb-[1rem]"
      onclick={onPrevious}
    >
      <MaterialSymbolsArrowWarmUpRounded/>
    </button>
    <div class="schematic-wrapper platform">
      {#key platform}
        <div
          class="schematic"
          in:fly={{ y: '100vh', duration: 600, opacity: 1, easing: quartOut }}
          out:fade={{ duration: 300 }}
        >
          <div
            class="body"
            style="height: {conv(vehicle.length)};"
          ></div>
        </div>
      {/key}
    </div>
    <button
      class="swap-button h-[2rem] mt-[1rem]"
      onclick={onNext}
    >
      <MaterialSymbolsArrowCoolDownRounded/>
    </button>
  </div>
</div>


<style>
  .schematic-wrapper {
    display: grid;
    overflow: hidden;

    & > * {
      grid-area: 1 / 1;
    }
  }

  .schematic {
    position: relative;
  }

  .icon {
    color: #fff;
    font-size: 1.5rem;
  }

  .vehicle {
    &.schematic-wrapper {
      background-image: url("$lib/assets/rail.svg");
      background-repeat: repeat-y;
      background-position-x: center;
    }

    .body {
      background: #fff;
      border: solid 6px lightgray;
      border-radius: 40px 40px / 90px 90px 2rem 2rem;

      .windshield {
        width: 75%;
        margin: 25px auto 0 auto;
      }
    }

    .entrance {
      position: absolute;
      width: 6px;
      background-color: #ff6e00;
      border-radius: 6px;

      &.inactive {
        background-color: gray;
      }
    }

    .place {
      position: absolute;
      padding: 0.5rem;
      background: #035ba7;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 0.5rem;
    }
  }

  .platform {
    .body {
      background: lightgray;
      background-image: url('$lib/assets/paving.svg');
      background-size: 20px;
    }
  }

  .access-info-box {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    transform: translateY(-50%);
    width: 100%;
    z-index: 1;

    &::before,
    &::after {
      content: "";
      display: block;
      flex: 1 0 1rem;
      height: 0;
      border-top: solid 4px black;
    }

    .access-icon {
      position: absolute;
      right: 0;
      top: 50%;
      border-radius: 50%;
      transform: translate(50%, -50%);
      padding: 0.25rem;
    }

    &.unknown {
      .access-icon {
        background-color: gray;
      }
    }

    &.good {
      .access-icon {
        background-color: #00b468;
      }
    }

    &.limited {
      &.access-info-box::before {
        border-style: dashed;
      }

      .access-icon {
        background-color: #ffca2c;
      }
    }

    &.bad {
      &.access-info-box::before {
        visibility: hidden;
      }

      .access-icon {
        background-color: #f80b37;
      }
    }
  }

  .swap-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: lightgray;
    transition-property: background-color, color;
    transition-duration: 0.3s;

    &:hover {
      background-color: gray;
      color: white;
    }
  }
</style>
