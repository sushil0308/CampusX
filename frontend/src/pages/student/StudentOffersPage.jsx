import React, { useState, useEffect } from 'react';
import { offerApi } from '../../services/api';
import { Badge, StatusBadge } from '../../components/common/Badge';
import { LoadingSpinner, EmptyState } from '../../components/common/EmptyState';
import {
  Award,
  Building2,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const StudentOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await offerApi.getStudentOffers();
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, status) => {
    const actionText = status === 'ACCEPTED' ? 'accept' : 'decline';
    if (!window.confirm(`Are you sure you want to ${actionText} this offer?`)) return;

    try {
      await offerApi.respondToOffer(id, status);
      loadOffers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update offer');
    }
  };

  if (loading) return <LoadingSpinner text="Loading placement offers..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white tracking-tight">Placement Job Offers</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review official employment packages extended by campus hiring partners.
        </p>
      </div>

      {offers.length > 0 ? (
        <div className="space-y-5">
          {offers.map((offer) => {
            const isOffered = offer.status === 'OFFERED';
            const isAccepted = offer.status === 'ACCEPTED';

            return (
              <div
                key={offer.id}
                className={`glass-card rounded-3xl p-6 sm:p-8 border ${
                  isAccepted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'
                } relative overflow-hidden space-y-6`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <img
                        src={offer.company?.logoUrl || 'https://via.placeholder.com/56'}
                        alt={offer.company?.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                          {offer.company?.name}
                        </span>
                        <StatusBadge status={offer.status} />
                      </div>
                      <h3 className="text-xl font-black text-white mt-1">{offer.designation}</h3>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-slate-400 font-medium">Offered Annual CTC</p>
                    <p className="text-3xl font-black text-emerald-400">{offer.packageLpa} LPA</p>
                  </div>
                </div>

                {/* Offer Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 font-medium">Anticipated Joining Date</span>
                    <p className="text-sm font-bold text-white mt-1">
                      {offer.joiningDate || 'July 2025'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 font-medium">Decision Expiry Date</span>
                    <p className="text-sm font-bold text-amber-400 mt-1">
                      {offer.offerExpiryDate || 'Within 14 days'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 font-medium">Official Letter</span>
                    <div className="mt-1">
                      <a
                        href={offer.offerLetterUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center space-x-1"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Response Actions */}
                {isOffered && (
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => handleRespond(offer.id, 'REJECTED')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      Decline Offer
                    </button>
                    <button
                      onClick={() => handleRespond(offer.id, 'ACCEPTED')}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Official Offer</span>
                    </button>
                  </div>
                )}

                {isAccepted && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>
                      You have accepted this offer! Your profile has been updated to Placed status with the Placement Cell.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No offers extended yet"
          message="Once you clear all technical and managerial rounds, your official offers will appear here."
        />
      )}
    </div>
  );
};
