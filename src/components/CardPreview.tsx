import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TemplateConfig, UserCardData } from '../types/template';
import { renderCardToCanvas, preloadTemplateAssets } from '../services/renderingEngine';
import { Move } from 'lucide-react';

interface CardPreviewProps {
  template: TemplateConfig;
  userData: UserCardData;
  onUpdatePosition: (newPos: { x: number; y: number; zoom: number }) => void;
  isExporting: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  template,
  userData,
  onUpdatePosition,
  isExporting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);

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

  // Handle direct canvas photo dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!userData.photoImage || !canvasRef.current) return;

    setIsDragging(true);
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: userData.photoPosition.x,
      startPosY: userData.photoPosition.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = template.dimensions.width / rect.width;

    const deltaX = (e.clientX - dragStartRef.current.startMouseX) * scaleFactor;
    const deltaY = (e.clientY - dragStartRef.current.startMouseY) * scaleFactor;

    onUpdatePosition({
      ...userData.photoPosition,
      x: Math.round(dragStartRef.current.startPosX + deltaX),
      y: Math.round(dragStartRef.current.startPosY + deltaY),
    });
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
        className={`preview-canvas-container ${isDragging ? 'is-dragging' : ''} ${userData.photoImage ? 'has-photo' : ''}`}
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

        {/* Drag Hint Overlay when photo is loaded */}
        {userData.photoImage && !isDragging && (
          <div className="canvas-drag-hint">
            <Move size={14} />
            <span>Drag photo to adjust position</span>
          </div>
        )}

        {/* Exporting Loading Overlay */}
        {isExporting && (
          <div className="canvas-export-overlay">
            <div className="spinner" />
            <p>Generating your official card...</p>
          </div>
        )}
      </div>
    </div>
  );
};
