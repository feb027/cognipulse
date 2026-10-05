'use client';

import { useState, useEffect, useCallback } from 'react';
import { DriverWithLatestAssessment } from '@/types/fleet';

export function useActiveDriver() {
  const [drivers, setDrivers] = useState<DriverWithLatestAssessment[]>([]);
  const [activeDriver, setActiveDriver] = useState<DriverWithLatestAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drivers');
      const data = await res.json();
      if (res.ok && data.drivers) {
        setDrivers(data.drivers);
        setActiveDriver((prev) => {
          if (!prev) return data.drivers[0] || null;
          const matched = data.drivers.find((d: DriverWithLatestAssessment) => d.id === prev.id);
          return matched || data.drivers[0] || null;
        });
      }
    } catch (err) {
      console.error('Failed to load drivers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const selectDriver = (driver: DriverWithLatestAssessment) => {
    setActiveDriver(driver);
  };

  const handleDriverCreated = (newDriver: DriverWithLatestAssessment) => {
    setDrivers((prev) => [newDriver, ...prev]);
    setActiveDriver(newDriver);
  };

  return {
    drivers,
    activeDriver,
    loading,
    isSelectOpen,
    setIsSelectOpen,
    isRegisterOpen,
    setIsRegisterOpen,
    selectDriver,
    handleDriverCreated,
    refreshDrivers: fetchDrivers,
  };
}
