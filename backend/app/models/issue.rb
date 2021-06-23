class Issue < ApplicationRecord
	belongs_to :issue_label


	validates :issue_id, presence: true, numericality: { only_integer: true, greater_than: 0}
	validates :title, presence: true
	# validates :description, allow_nil: true
	validate :valid_duedate?

	private

	def valid_duedate?
		return if due_date.nil?
		if ((DateTime.parse(due_date.to_s) rescue ArgumentError) == ArgumentError)
			errors.add(:due_date, 'not valid date_time') 
		elsif ((DateTime.parse(due_date.to_s)) <= DateTime.current)
			errors.add(:due_date, 'needs to be in the furture')
		end
	end


end
