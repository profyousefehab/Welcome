import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TemplateConfig, UserCardData } from '../types/template';
import { renderCardToCanvas, preloadTemplateAssets } from '../services/renderingEngine';
import { Move, Maximize2, X } from 'lucide-react';

interface CardPreviewProps {
  template: TemplateConfig;
  userData: UserCardData;
  currentStep: 1 | 2 | 3;
  onUpdatePosition: (newPos: { x: number; y: number; zoom: number }) => void;
  onUpdateNamePosition?: (newPos: { x: number; y: number }) => void;
  isExporting: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  template,
  userData,
  currentStep,
  onUpdatePosition,
  onUpdateNamePosition,
  isExporting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dragStartRef = useRef<{
    mode: 'photo' | 'name';
    startMouseX: number;
    startMouseY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  // Preload template assets once
  useEffect(() => {
    let isMounted = true;
    preloadTemplateAssets(template).then(() => {
      if (isMounted) {
        setIsAssetsLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [template]);

  // Redraw canvas whenever template, userData, or asset status changes
  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    renderCardToCanvas(canvasRef.current, template, userData, 1.0);
  }, [template, userData]);

  useEffect(() => {
    redraw();
  }, [redraw, isAssetsLoaded]);

  // Handle direct canvas interaction (Step 1: photo only, Step 2: name text only, Step 3: locked)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isExporting || !canvasRef.current) return;

    // Step 1: Photo dragging
    if (currentStep === 1) {
      if (!userData.photoImage) return;

      setIsDragging(true);
      dragStartRef.current = {
        mode: 'photo',
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPosX: userData.photoPosition.x,
        startPosY: userData.photoPosition.y,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    // Step 2: Name text dragging
    if (currentStep === 2 && onUpdateNamePosition) {
      setIsDragging(true);
      dragStartRef.current = {
        mode: 'name',
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPosX: userData.namePosition?.x ?? 0,
        startPosY: userData.namePosition?.y ?? 0,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    // Step 3: Locked
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = template.dimensions.width / rect.width;

    const deltaX = (e.clientX - dragStartRef.current.startMouseX) * scaleFactor;
    const deltaY = (e.clientY - dragStartRef.current.startMouseY) * scaleFactor;

    if (dragStartRef.current.mode === 'photo') {
      onUpdatePosition({
        ...userData.photoPosition,
        x: Math.round(dragStartRef.current.startPosX + deltaX),
        y: Math.round(dragStartRef.current.startPosY + deltaY),
      });
    } else if (dragStartRef.current.mode === 'name' && onUpdateNamePosition) {
      onUpdateNamePosition({
        x: Math.round(dragStartRef.current.startPosX + deltaX),
        y: Math.round(dragStartRef.current.startPosY + deltaY),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture release fallback
      }
    }
  };

  return (
    <div className="card-preview-wrapper" ref={containerRef}>
      {/* Canvas Container with aspect ratio preservation */}
      <div 
        className={`preview-canvas-container step-${currentStep} ${isDragging ? 'is-dragging' : ''} ${userData.photoImage ? 'has-photo' : ''}`}
        style={{ aspectRatio: `${template.dimensions.width} / ${template.dimensions.height}` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          width={template.dimensions.width}
          height={template.dimensions.height}
          className="preview-canvas"
        />

        {/* Full View Inspect Button on Canvas */}
        <button
          type="button"
          className="btn-preview-expand"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
          title="Inspect full-size card"
          aria-label="Inspect full card"
        >
          <Maximize2 size={12} />
          <span>Full View</span>
        </button>

        {/* Step-Specific Canvas Hints */}
        {!isDragging && (
          <>
            {currentStep === 1 && userData.photoImage && (
              <div className="canvas-drag-hint">
                <Move size={14} />
                <span>Drag photo on canvas to position</span>
              </div>
            )}
            {currentStep === 2 && (
              <div className="canvas-drag-hint text-drag-hint">
                <Move size={14} />
                <span>Drag name on canvas to position</span>
              </div>
            )}
          </>
        )}

        {/* Exporting Loading Overlay */}
        {isExporting && (
          <div className="canvas-export-overlay">
            <div className="spinner" />
            <p>Generating your official card...</p>
          </div>
        )}
      </div>

      {/* Fullscreen Modal View for Mobile Inspection */}
      {isFullscreen && (
        <div className="canvas-fullscreen-modal" onClick={() => setIsFullscreen(false)}>
          <div className="fullscreen-modal-backdrop" />
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-modal-header">
              <span className="fullscreen-title">Official Membership Card</span>
              <button
                type="button"
                className="btn-close-fullscreen"
                onClick={() => setIsFullscreen(false)}
                aria-label="Close full view"
              >
                <X size={20} />
              </button>
            </div>
            <div
              className="fullscreen-canvas-wrapper"
              style={{ aspectRatio: `${template.dimensions.width} / ${template.dimensions.height}` }}
            >
              <canvas
                ref={(node) => {
                  if (node) {
                    renderCardToCanvas(node, template, userData, 1.0);
                  }
                }}
                width={template.dimensions.width}
                height={template.dimensions.height}
                className="preview-canvas-fullscreen"
              />
            </div>
            <div className="fullscreen-modal-footer">
              <button
                type="button"
                className="btn-modal-dismiss"
                onClick={() => setIsFullscreen(false)}
              >
                Close Full View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
