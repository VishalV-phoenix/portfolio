import React, { useState, useEffect, useRef } from 'react';
import { PROFILE_CONFIG } from '../config/profile';
import { WaterGlass } from './WaterGlass';

// Centralized Content Modules
import { PROJECTS_GALLERY, PROJECTS_UI_COPY } from '../content/projectsContent';
import { SKILL_CATEGORIES, SKILLS_UI_COPY } from '../content/skillsContent';
import {
  ABOUT_UI_COPY,
  ABOUT_TAGS,
  ABOUT_BIOGRAPHY_PARAGRAPHS,
} from '../content/aboutContent';
import { CONTACT_UI_COPY } from '../content/contactContent';

// Centralized Card Visual & Layout Settings
import {
  MILESTONE_TIMINGS,
  MILESTONE_CARD_STYLES,
  SHARED_CARD_SETTINGS,
  MilestoneTiming,
} from '../config/cards/sharedCardSettings';
import { PROJECTS_CARD_SETTINGS } from '../config/cards/projectsCardSettings';
import { SKILLS_CARD_SETTINGS } from '../config/cards/skillsCardSettings';
import { ABOUT_CARD_SETTINGS } from '../config/cards/aboutCardSettings';
import { CONTACT_CARD_SETTINGS } from '../config/cards/contactCardSettings';

interface PortfolioShowcaseStageProps {
  /**
   * Progress of Tree Timelapse Stage D (0.0 to 1.0)
   */
  treeProgress?: number;
  /**
   * Progress of Final Showcase Stage E (0.0 to 1.0)
   */
  progress: number;
  targetMilestone?: { id: string; targetD: number; timestamp: number } | null;
  onMilestoneArrived?: () => void;
}

const MILESTONES = MILESTONE_TIMINGS;

function getMilestoneTransform(progress: number, m: MilestoneTiming) {
  const yOffset = SHARED_CARD_SETTINGS.translateYOffsetPx;
  if (progress < m.start || progress > m.end) {
    return { opacity: 0, translateY: yOffset, active: false };
  }
  if (progress < m.fadeInEnd) {
    const t = (progress - m.start) / (m.fadeInEnd - m.start);
    return { opacity: t, translateY: (1 - t) * yOffset, active: t > 0.05 };
  }
  if (progress <= m.fadeOutStart) {
    return { opacity: 1, translateY: 0, active: true };
  }
  const t = (progress - m.fadeOutStart) / (m.end - m.fadeOutStart);
  return { opacity: Math.max(0, 1 - t), translateY: -t * yOffset, active: 1 - t > 0.05 };
}

export const PortfolioShowcaseStage: React.FC<PortfolioShowcaseStageProps> = ({
  treeProgress = 0,
  progress,
  targetMilestone,
  onMilestoneArrived,
}) => {
  // Stage D milestone card opacity state: exactly one card can be opaque, or null for transparent
  const [opaqueMilestoneId, setOpaqueMilestoneId] = useState<string | null>(null);

  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Refs for Stage D milestone cards (used for outside-click detection)
  const milestoneCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const clampedTreeProgress = Math.max(0, Math.min(1, treeProgress));
  const clampedE = Math.max(0, Math.min(1, progress));

  // Shared helper: provides ref, onPointerEnter, onPointerMove, and background classes for all 4 milestone cards
  const getMilestoneCardProps = (id: string) => {
    const isOpaque = opaqueMilestoneId === id;
    return {
      ref: (el: HTMLDivElement | null) => {
        if (el) milestoneCardRefs.current.set(id, el);
        else milestoneCardRefs.current.delete(id);
      },
      onPointerEnter: () => {
        // Prevent intermediate cards from becoming opaque while navigating to another target
        if (!targetMilestone || targetMilestone.id === id) {
          setOpaqueMilestoneId(id);
        }
      },
      onPointerMove: () => {
        // Prevent intermediate cards from becoming opaque while navigating to another target
        if (!targetMilestone || targetMilestone.id === id) {
          if (opaqueMilestoneId !== id) {
            setOpaqueMilestoneId(id);
          }
        }
      },
      onPointerDown: (e: React.PointerEvent) => {
        e.stopPropagation();
        if (opaqueMilestoneId !== id) {
          setOpaqueMilestoneId(id);
        }
      },
      bgClass: isOpaque ? MILESTONE_CARD_STYLES.opaque : MILESTONE_CARD_STYLES.transparent,
      isOpaque,
    };
  };

  // Collapse expanded project when navigating away from Projects
  useEffect(() => {
    if (targetMilestone && targetMilestone.id !== 'projects') {
      setExpandedProjectId(null);
    }
  }, [targetMilestone]);

  // Immediately set destination card opaque when programmatic navigation starts
  useEffect(() => {
    if (targetMilestone) {
      setOpaqueMilestoneId(targetMilestone.id);
    }
  }, [targetMilestone]);

  // Handle programmatic navigation arrival at target milestone card
  useEffect(() => {
    if (!targetMilestone) return;

    const milestoneTiming = MILESTONES.find((m) => m.id === targetMilestone.id);
    const isAtDestination = milestoneTiming
      ? clampedTreeProgress >= milestoneTiming.fadeInEnd && clampedTreeProgress <= milestoneTiming.fadeOutStart
      : Math.abs(clampedTreeProgress - targetMilestone.targetD) <= 0.05;

    if (isAtDestination) {
      setOpaqueMilestoneId(targetMilestone.id);
      onMilestoneArrived?.();
    }
  }, [clampedTreeProgress, targetMilestone, onMilestoneArrived]);

  // Safety fallback for programmatic navigation (scrollend or max 1.5s timeout)
  useEffect(() => {
    if (!targetMilestone) return;

    const timer = window.setTimeout(() => {
      const milestoneTiming = MILESTONES.find((m) => m.id === targetMilestone.id);
      if (milestoneTiming && clampedTreeProgress >= milestoneTiming.start && clampedTreeProgress <= milestoneTiming.end) {
        setOpaqueMilestoneId(targetMilestone.id);
      }
      onMilestoneArrived?.();
    }, 1500);

    const handleScrollEnd = () => {
      const milestoneTiming = MILESTONES.find((m) => m.id === targetMilestone.id);
      if (milestoneTiming && clampedTreeProgress >= milestoneTiming.start && clampedTreeProgress <= milestoneTiming.end) {
        setOpaqueMilestoneId(targetMilestone.id);
      }
      onMilestoneArrived?.();
    };

    window.addEventListener('scrollend', handleScrollEnd, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [targetMilestone, clampedTreeProgress, onMilestoneArrived]);

  // Reset active milestone card opacity when it scrolls completely out of view
  useEffect(() => {
    if (!opaqueMilestoneId) return;
    // Guard: If programmatic navigation is actively targeting this milestone, do NOT reset its opacity
    if (targetMilestone && targetMilestone.id === opaqueMilestoneId) return;

    const activeMilestone = MILESTONES.find((m) => m.id === opaqueMilestoneId);
    if (activeMilestone) {
      if (clampedTreeProgress < activeMilestone.start - 0.01 || clampedTreeProgress > activeMilestone.end + 0.01) {
        setOpaqueMilestoneId(null);
      }
    }
  }, [clampedTreeProgress, opaqueMilestoneId, targetMilestone]);

  // Collapse expanded project when scrolling away from Projects milestone
  useEffect(() => {
    if (clampedTreeProgress < 0.005 || clampedTreeProgress > 0.22) {
      if (expandedProjectId) {
        setExpandedProjectId(null);
      }
    }
  }, [clampedTreeProgress, expandedProjectId]);

  // Collapse expanded project on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedProjectId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Outside-click detection:
  // - Clicking outside milestone cards returns the active card to State A (transparent)
  // - Clicking inside any milestone card keeps it opaque
  // - Clicks on navigation items do not reset milestone card opacity
  // - Pointer events during in-flight programmatic navigation do not reset milestone card opacity
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!target) return;

      // Do not reset opacity while programmatic navigation is in progress
      if (targetMilestone) {
        return;
      }

      // Do not treat clicks on navigation buttons as outside-clicks that reset opacity
      if (target instanceof Element && target.closest('[role="navigation"], .water-glass-nav')) {
        return;
      }

      let clickedInsideMilestone = false;
      for (const el of milestoneCardRefs.current.values()) {
        if (el && el.contains(target)) {
          clickedInsideMilestone = true;
          break;
        }
      }

      if (!clickedInsideMilestone) {
        setOpaqueMilestoneId(null);
        setExpandedProjectId(null);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [targetMilestone]);

  return (
    <>
      {/* ====================================================================
          STAGE D: FOREGROUND MILESTONE CARDS OVER GROWING TREE (z-index: 15)
          Exactly 4 cards (Projects, Skills, About, Contact)
          Exactly 2 states:
          - Default: Highly transparent (bg-white/5, no blur, tree/particles clearly visible)
          - Hover: Opaque dark background (bg-neutral-950/85, backdrop-blur-xl, gold border)
          ==================================================================== */}
      {clampedE <= 0.05 && (
        <>
          {MILESTONES.map((m) => {
            const { opacity, translateY, active } = getMilestoneTransform(clampedTreeProgress, m);
            if (!active && opacity <= 0.005) return null;

            const cardProps = getMilestoneCardProps(m.id);

            if (m.id === 'projects') {
              const expandedProject = PROJECTS_GALLERY.find((p) => p.id === expandedProjectId);

              return (
                <div
                  key={m.id}
                  className="fixed inset-0 z-15 flex flex-col items-center justify-start sm:justify-center pt-16 sm:pt-0 pb-4 sm:pb-0 px-3 sm:px-4 pointer-events-none select-none"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                  aria-label="Milestone: Projects Gallery"
                >
                  <div
                    ref={cardProps.ref}
                    onPointerEnter={cardProps.onPointerEnter}
                    onPointerMove={cardProps.onPointerMove}
                    onPointerDown={cardProps.onPointerDown}
                    className={`${PROJECTS_CARD_SETTINGS.paddingClass} ${SHARED_CARD_SETTINGS.roundedCornerClass} border transition-all duration-300 pointer-events-auto ${PROJECTS_CARD_SETTINGS.maxWidthClass} w-full text-left ${PROJECTS_CARD_SETTINGS.mobileMaxHeightClass} overflow-y-auto custom-scrollbar ${cardProps.bgClass}`}
                  >
                    {!expandedProject ? (
                      /* ==========================================================
                         COLLAPSED TWO-PROJECT GALLERY VIEW
                         ========================================================== */
                      <>
                        {/* Eyebrow Header */}
                        <div className="flex items-center justify-between mb-2.5 sm:mb-4 pb-2 sm:pb-2.5 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                              {PROJECTS_UI_COPY.eyebrow}
                            </span>
                            <span className="text-neutral-500 text-xs">•</span>
                            <span className="text-xs font-mono text-neutral-300">
                              {PROJECTS_UI_COPY.sectionTitle}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                            {PROJECTS_UI_COPY.instructions}
                          </span>
                        </div>

                        {/* 2-Project Cards Grid */}
                        <div className={`grid ${PROJECTS_CARD_SETTINGS.galleryGridColsClass} ${PROJECTS_CARD_SETTINGS.galleryGridGapClass}`}>
                          {PROJECTS_GALLERY.map((proj) => (
                            <div
                              key={proj.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProjectId(proj.id);
                              }}
                              className={`${PROJECTS_CARD_SETTINGS.projectCardPaddingClass} ${PROJECTS_CARD_SETTINGS.projectCardRadiusClass} border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-400/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between`}
                            >
                              {/* Thumbnail preview */}
                              <div className={`${PROJECTS_CARD_SETTINGS.collapsedThumbnailHeightClass} w-full rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-2.5 sm:mb-3 relative flex items-center justify-center`}>
                                <img
                                  src={proj.collapsedImage}
                                  alt={proj.title}
                                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                              </div>

                              <div>
                                {/* Eyebrow and Expand Indicator */}
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] sm:text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                                    {proj.eyebrow}
                                  </span>
                                  <span className="text-neutral-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-amber-300">
                                    →
                                  </span>
                                </div>

                                {/* Title */}
                                <h4 className="text-sm sm:text-lg font-medium text-white mb-0.5 sm:mb-1 group-hover:text-amber-200 transition-colors">
                                  {proj.title}
                                </h4>

                                {/* Short Description */}
                                <p className="text-xs text-neutral-300 line-clamp-2 mb-2.5 sm:mb-3 leading-relaxed">
                                  {proj.shortDescription}
                                </p>
                              </div>

                              {/* Technology Tags */}
                              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                                {proj.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={PROJECTS_CARD_SETTINGS.tagBadgeClass}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* ==========================================================
                         EXPANDED PROJECT VIEW
                         ========================================================== */
                      <div className={`space-y-4 ${PROJECTS_CARD_SETTINGS.expandedScrollContainerMaxHeightClass} overflow-y-auto pr-1.5 custom-scrollbar`}>
                        {/* Top Bar with Back and Close Controls */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedProjectId(null);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors cursor-pointer px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/30 active:scale-95"
                          >
                            {PROJECTS_UI_COPY.backButtonText}
                          </button>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                              {expandedProject.eyebrow}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProjectId(null);
                              }}
                              className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm font-mono leading-none"
                              aria-label={PROJECTS_UI_COPY.closeAriaLabel}
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Main Project Header & Visual Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Image preview */}
                          <div className={`md:col-span-5 ${PROJECTS_CARD_SETTINGS.expandedImageHeightClass} w-full rounded-xl overflow-hidden bg-black/80 border border-white/10 relative flex items-center justify-center`}>
                            <img
                              src={expandedProject.expandedImage}
                              alt={expandedProject.title}
                              className="w-full h-full object-contain bg-black/80"
                            />
                          </div>

                          {/* Details & Actions */}
                          <div className="md:col-span-7 space-y-3">
                            <div>
                              <span className="text-xs font-mono text-amber-300/90 uppercase tracking-wider block mb-1">
                                {expandedProject.eyebrow}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-medium text-white">
                                {expandedProject.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2">
                                {expandedProject.overview}
                              </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {expandedProject.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={PROJECTS_CARD_SETTINGS.expandedTagBadgeClass}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* GitHub Action Link */}
                            <div className="pt-1.5">
                              <a
                                href={expandedProject.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-amber-400/20 text-white hover:text-amber-200 border border-white/20 hover:border-amber-400/50 text-xs font-mono font-medium transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <span>{PROJECTS_UI_COPY.githubButtonText}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Key Features & Technical Details Sections */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          {/* Key Features */}
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <h5 className="text-xs uppercase font-mono tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                              {PROJECTS_UI_COPY.featuresHeader}
                            </h5>
                            <ul className="space-y-1.5 text-xs text-neutral-300">
                              {expandedProject.keyFeatures.map((feat, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-400/80 leading-none mt-0.5">•</span>
                                  <span className="leading-relaxed">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Technical Details */}
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <h5 className="text-xs uppercase font-mono tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                              {PROJECTS_UI_COPY.techDetailsHeader}
                            </h5>
                            <div className="space-y-2 text-xs text-neutral-300">
                              {expandedProject.technicalDetails.map((tech, i) => (
                                <div key={i} className="border-b border-white/5 pb-1.5 last:border-none last:pb-0">
                                  <div className="text-[11px] font-mono text-neutral-400 uppercase">{tech.label}</div>
                                  <div className="text-neutral-200 mt-0.5">{tech.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (m.id === 'skills') {
              const filteredCategories =
                selectedSkillCategory === 'all'
                  ? SKILL_CATEGORIES
                  : SKILL_CATEGORIES.filter((c) => c.id === selectedSkillCategory);

              return (
                <div
                  key={m.id}
                  className="fixed inset-0 z-15 flex flex-col items-center justify-center px-4 pointer-events-none select-none"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                  aria-label="Milestone: Skills Gallery"
                >
                  <div
                    ref={cardProps.ref}
                    onPointerEnter={cardProps.onPointerEnter}
                    onPointerMove={cardProps.onPointerMove}
                    onPointerDown={cardProps.onPointerDown}
                    className={`${SKILLS_CARD_SETTINGS.paddingClass} ${SHARED_CARD_SETTINGS.roundedCornerClass} border transition-all duration-300 pointer-events-auto ${SKILLS_CARD_SETTINGS.maxWidthClass} w-full text-left ${cardProps.bgClass}`}
                  >
                    {/* Eyebrow Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-3.5 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider">
                          {SKILLS_UI_COPY.eyebrow}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs font-mono text-neutral-300">
                          {SKILLS_UI_COPY.sectionTitle}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                        {SKILLS_UI_COPY.summarySubtitle}
                      </span>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkillCategory('all');
                        }}
                        className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer active:scale-95 ${
                          selectedSkillCategory === 'all'
                            ? SKILLS_CARD_SETTINGS.activeTabClass
                            : SKILLS_CARD_SETTINGS.inactiveTabClass
                        }`}
                      >
                        {SKILLS_UI_COPY.allTabLabel}
                      </button>
                      {SKILL_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSkillCategory(cat.id);
                          }}
                          className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-all duration-150 whitespace-nowrap cursor-pointer active:scale-95 ${
                            selectedSkillCategory === cat.id
                              ? SKILLS_CARD_SETTINGS.activeTabClass
                              : SKILLS_CARD_SETTINGS.inactiveTabClass
                          }`}
                        >
                          {cat.tabLabel}
                        </button>
                      ))}
                    </div>

                    {/* Categories Container */}
                    <div className={`space-y-3 ${SKILLS_CARD_SETTINGS.categoriesContainerMaxHeightClass} overflow-y-auto pr-1.5 custom-scrollbar`}>
                      {filteredCategories.map((cat) => {
                        const isCollapsed = selectedSkillCategory === 'all' && collapsedCategories[cat.id];

                        return (
                          <div
                            key={cat.id}
                            className="p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 transition-colors hover:border-white/15"
                          >
                            {/* Category Header */}
                            <div
                              className="flex items-center justify-between cursor-pointer select-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedSkillCategory === 'all') {
                                  toggleCategoryCollapse(cat.id);
                                }
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">
                                  {cat.eyebrow}
                                </span>
                                <span className="text-neutral-500 text-xs hidden sm:inline">•</span>
                                <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
                                  {cat.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                                  {cat.skills.length} {SKILLS_UI_COPY.itemsSuffix}
                                </span>
                                {selectedSkillCategory === 'all' && (
                                  <span className="text-xs font-mono text-neutral-400">
                                    {isCollapsed ? '+' : '−'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Skills Grid */}
                            {!isCollapsed && (
                              <div className={`grid ${SKILLS_CARD_SETTINGS.skillsGridColsClass} ${SKILLS_CARD_SETTINGS.skillsGridGapClass} mt-2.5`}>
                                {cat.skills.map((skill) => (
                                  <div
                                    key={skill.name}
                                    onClick={(e) => e.stopPropagation()}
                                    className={SKILLS_CARD_SETTINGS.skillItemClass}
                                    title={skill.name}
                                  >
                                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                      {skill.icon}
                                    </div>
                                    <span className="text-xs text-neutral-200 font-mono group-hover:text-amber-200 transition-colors truncate">
                                      {skill.shortLabel || skill.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Bar */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center text-xs">
                      <span className="text-neutral-400 font-mono text-[11px]">
                        {SKILLS_UI_COPY.footerFootnote}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (m.id === 'about') {
              return (
                <div
                  key={m.id}
                  className="fixed inset-0 z-15 flex flex-col items-center justify-start md:justify-center pt-16 md:pt-0 pb-4 md:pb-0 px-3 md:px-4 pointer-events-none select-none"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                  aria-label="Milestone: The Story"
                >
                  <div
                    ref={cardProps.ref}
                    onPointerEnter={cardProps.onPointerEnter}
                    onPointerMove={cardProps.onPointerMove}
                    onPointerDown={cardProps.onPointerDown}
                    className={`${ABOUT_CARD_SETTINGS.paddingClass} ${SHARED_CARD_SETTINGS.roundedCornerClass} border transition-all duration-300 pointer-events-auto ${ABOUT_CARD_SETTINGS.maxWidthClass} w-full text-left ${ABOUT_CARD_SETTINGS.mobileMaxHeightClass} overflow-y-auto custom-scrollbar ${cardProps.bgClass}`}
                  >
                    {/* Eyebrow Header */}
                    <div className="flex items-center justify-between mb-2.5 md:mb-4 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider font-semibold">
                          {ABOUT_UI_COPY.eyebrow}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs font-mono text-neutral-300">
                          {ABOUT_UI_COPY.sectionTitle}
                        </span>
                      </div>
                    </div>

                    {/* Main Heading */}
                    <h3 className="text-xl md:text-2xl font-medium text-white mb-2.5 md:mb-4 tracking-tight leading-snug">
                      {ABOUT_UI_COPY.mainHeading}
                    </h3>

                    {/* Paragraphs with Gold-Highlighted Keywords */}
                    <div className={`${ABOUT_CARD_SETTINGS.paragraphSpacingClass} ${ABOUT_CARD_SETTINGS.paragraphTextClass}`}>
                      {ABOUT_BIOGRAPHY_PARAGRAPHS.map((p) => (
                        <p key={p.id}>
                          {p.segments.map((seg, i) =>
                            seg.isHighlight ? (
                              <span
                                key={i}
                                className={ABOUT_CARD_SETTINGS.highlightBadgeClass}
                              >
                                {seg.text}
                              </span>
                            ) : (
                              <React.Fragment key={i}>{seg.text}</React.Fragment>
                            )
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Closing Tags */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2.5 md:pt-4 border-t border-white/10 mt-2.5 md:mt-4">
                      {ABOUT_TAGS.map((tag) => (
                        <span
                          key={tag}
                          className={ABOUT_CARD_SETTINGS.tagBadgeClass}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (m.id === 'contact') {
              const githubSocial = PROFILE_CONFIG.socials.find((s) => s.id === 'github');
              const linkedinSocial = PROFILE_CONFIG.socials.find((s) => s.id === 'linkedin');
              const emailSocial = PROFILE_CONFIG.socials.find((s) => s.id === 'email');

              const githubUrl = githubSocial?.url || 'https://github.com/VishalV-phoenix';
              const linkedinUrl = linkedinSocial?.url || 'https://www.linkedin.com/in/vishal-v-821996387/';
              const emailUrl = emailSocial?.url
                ? (emailSocial.url.includes('?') ? emailSocial.url : `${emailSocial.url}?subject=${CONTACT_UI_COPY.emailSubjectQuery}`)
                : `mailto:vishalv6010@gmail.com?subject=${CONTACT_UI_COPY.emailSubjectQuery}`;

              return (
                <div
                  key={m.id}
                  className="fixed inset-0 z-15 flex flex-col items-center justify-center px-4 pointer-events-none select-none"
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                  aria-label="Milestone: Connect"
                >
                  <div
                    ref={cardProps.ref}
                    onPointerEnter={cardProps.onPointerEnter}
                    onPointerMove={cardProps.onPointerMove}
                    onPointerDown={cardProps.onPointerDown}
                    className={`${CONTACT_CARD_SETTINGS.paddingClass} ${SHARED_CARD_SETTINGS.roundedCornerClass} border transition-all duration-300 pointer-events-auto ${CONTACT_CARD_SETTINGS.maxWidthClass} w-full text-left ${cardProps.bgClass}`}
                  >
                    {/* Eyebrow Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-300/80 uppercase tracking-wider font-semibold">
                          {CONTACT_UI_COPY.eyebrow}
                        </span>
                        <span className="text-neutral-500 text-xs">•</span>
                        <span className="text-xs font-mono text-neutral-300">
                          {CONTACT_UI_COPY.sectionTitle}
                        </span>
                      </div>
                    </div>

                    {/* Main Heading */}
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-2 sm:mb-2.5 tracking-tight leading-snug">
                      {CONTACT_UI_COPY.mainHeading}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4 sm:mb-5">
                      {CONTACT_UI_COPY.description}
                    </p>

                    {/* Contact Action Buttons (Reveal WaterGlass pill style) */}
                    <div className={`flex flex-wrap items-center justify-start ${CONTACT_CARD_SETTINGS.buttonGroupGapClass} my-4 sm:my-5`}>
                      {/* GitHub */}
                      <WaterGlass
                        as="a"
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant={CONTACT_CARD_SETTINGS.waterGlassVariant}
                        theme={CONTACT_CARD_SETTINGS.waterGlassTheme}
                        elevation={CONTACT_CARD_SETTINGS.waterGlassElevation}
                        showGlint={CONTACT_CARD_SETTINGS.showGlint}
                        rippleOnHover={CONTACT_CARD_SETTINGS.enableRipples}
                        rippleOnClick={CONTACT_CARD_SETTINGS.enableRipples}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="GitHub profile (opens in a new tab)"
                        className={CONTACT_CARD_SETTINGS.buttonClassName}
                      >
                        <svg className="w-4 h-4 fill-[#fcfcfb] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 shrink-0" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        <span>GitHub</span>
                      </WaterGlass>

                      {/* LinkedIn */}
                      <WaterGlass
                        as="a"
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant={CONTACT_CARD_SETTINGS.waterGlassVariant}
                        theme={CONTACT_CARD_SETTINGS.waterGlassTheme}
                        elevation={CONTACT_CARD_SETTINGS.waterGlassElevation}
                        showGlint={CONTACT_CARD_SETTINGS.showGlint}
                        rippleOnHover={CONTACT_CARD_SETTINGS.enableRipples}
                        rippleOnClick={CONTACT_CARD_SETTINGS.enableRipples}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="LinkedIn profile (opens in a new tab)"
                        className={CONTACT_CARD_SETTINGS.buttonClassName}
                      >
                        <svg className="w-4 h-4 fill-[#fcfcfb] opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37z" />
                        </svg>
                        <span>LinkedIn</span>
                      </WaterGlass>

                      {/* Gmail */}
                      <WaterGlass
                        as="a"
                        href={emailUrl}
                        variant={CONTACT_CARD_SETTINGS.waterGlassVariant}
                        theme={CONTACT_CARD_SETTINGS.waterGlassTheme}
                        elevation={CONTACT_CARD_SETTINGS.waterGlassElevation}
                        showGlint={CONTACT_CARD_SETTINGS.showGlint}
                        rippleOnHover={CONTACT_CARD_SETTINGS.enableRipples}
                        rippleOnClick={CONTACT_CARD_SETTINGS.enableRipples}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Send email to Vishal"
                        className={CONTACT_CARD_SETTINGS.buttonClassName}
                      >
                        <svg className="w-4 h-4 stroke-[#fcfcfb] fill-none opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 shrink-0" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span>Gmail</span>
                      </WaterGlass>
                    </div>

                    {/* Supporting Line */}
                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                      <span className="text-amber-400/80 leading-none">{CONTACT_UI_COPY.footnoteSymbol}</span>
                      <span>{CONTACT_UI_COPY.footnoteText}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </>
      )}
    </>
  );
};
